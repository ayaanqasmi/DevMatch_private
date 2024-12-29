import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_cohere import CohereEmbeddings
from pymongo import MongoClient
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
import re

# Load environment variables from .env file
load_dotenv()

class DocumentLoader:
    def __init__(self, chunk_size=1500, chunk_overlap=50, embedding_model="embed-english-light-v3.0"):
        """
        Initializes the DocumentLoader class with chunk size, overlap, and embedding model.

        Args:
            chunk_size (int): Size of text chunks for splitting. Default is 1500.
            chunk_overlap (int): Overlap size between chunks. Default is 50.
            embedding_model (str): Name of the embedding model to use. Default is 'embed-english-light-v3.0'.
        """
        # Set up the text splitter to divide documents into chunks
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
        self.embedding_model = embedding_model

    def embed_document(self, document_text):
        """
        Embeds the input document text using the specified embedding model.

        Args:
            document_text (str): The text of the document to embed.
        
        Returns:
            list: The embeddings of the document.
        """
        # Create embeddings for the document using CohereEmbeddings
        embeddings = CohereEmbeddings(model=self.embedding_model)
        return embeddings.embed_query(document_text)

    def store_in_vector_db(self, documentText, documentId, db_name="rag_db", collection_name="resume", index_name="resume_index"):
        """
        Stores the document in the MongoDB vector database after splitting into chunks and creating embeddings.

        Args:
            documentText (str): The text of the document to store.
            documentId (str): The unique ID for the document.
            db_name (str): Name of the MongoDB database.
            collection_name (str): Name of the MongoDB collection.
            index_name (str): Name of the search index.
        
        Returns:
            MongoDBAtlasVectorSearch: The vector store containing the document chunks.
        """
        documents = []
        document = Document(page_content=documentText, metadata={"source": documentId})
        
        # Split the document into chunks
        chunks = self.text_splitter.split_documents([document])  
        documents.extend(chunks)

        # Create embeddings for the chunks and connect to the MongoDB database
        embeddings = CohereEmbeddings(model=self.embedding_model)
        mongodb_uri = os.getenv("MONGODB_URI")
        client = MongoClient(mongodb_uri)
        collection = client[db_name][collection_name]

        # Store the document in MongoDB Atlas vector search
        vector_store = MongoDBAtlasVectorSearch.from_documents(
            documents=documents,
            embedding=embeddings,
            collection=collection,
            index_name=index_name
        )

        return vector_store

    def delete_documents_by_id(self, document_id, db_name="rag_db", collection_name="resume"):
        """
        Deletes documents from the MongoDB vector database by matching document ID.

        Args:
            document_id (str): The ID of the document to delete.
            db_name (str): Name of the MongoDB database.
            collection_name (str): Name of the MongoDB collection.
        
        Returns:
            int: The number of deleted documents.
        """
        # Connect to MongoDB and delete the documents with the specified document_id
        mongodb_uri = os.getenv("MONGODB_URI")
        if not mongodb_uri:
            raise ValueError("MONGODB_URI environment variable is not set.")

        client = MongoClient(mongodb_uri)
        collection = client[db_name][collection_name]

        # Delete documents where the 'source' metadata matches the document_id
        delete_result = collection.delete_many({"source": document_id})

        return delete_result.deleted_count

    def query_vector_db(self, query, db_name="rag_db", collection_name="resume", index_name="resume_index"):
        """
        Queries the vector database for documents similar to the given query.

        Args:
            query (str): The query to search for.
            db_name (str): Name of the MongoDB database.
            collection_name (str): Name of the MongoDB collection.
            index_name (str): Name of the search index.

        Returns:
            dict: The search results from the vector database.
        """
        # Connect to MongoDB
        mongodb_uri = os.getenv("MONGODB_URI")
        if not mongodb_uri:
            raise ValueError("MONGODB_URI environment variable is not set.")

        client = MongoClient(mongodb_uri)
        collection = client[db_name][collection_name]

        # Set up the vector store and retriever
        vector_store = MongoDBAtlasVectorSearch(
            collection=collection,
            embedding=CohereEmbeddings(model=self.embedding_model),
            index_name=index_name
        )
        doc_count = collection.count_documents({})
        print(f"Number of documents in the collection: {doc_count}")
        retriever = vector_store.as_retriever(
            search_type="similarity",
            return_metadata=True
        )

        # Set up the language model (Google Generative AI)
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
        )

        # Define the prompt template for the query
        prompt = PromptTemplate.from_template("""
        Find the most suitable resume based on the following Job description in terms of experience. Explain why. 
        Return the answer in JSON format, with a field for metadata, and a field for explanation. The metadata field must only include document_id and source. Nothing else.
        DO not mention resume id to the explanation. The explanation will be sent directly to the recruiter, so keep it courteous, and do not reveal any backend metadata in it.
        Once again, I emphasize: Return the answer in JSON format, with a field for metadata, and a field for explanation. The metadata field must only include document_id and source. Nothing else.                                                                    
        Job Description: {question}
        Context: {context}
        """)
        
        # Chain the retriever, prompt, and language model to get the results
        rag_chain = (
            {"context": retriever, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )

        # Invoke the query and get the results
        question = str(query)
        try:
            results = rag_chain.invoke(question)
            if results:
                print("LLM Response:", results)
                return {"response": results}
        except Exception as e:
            print(f"An error occurred: {e}")
