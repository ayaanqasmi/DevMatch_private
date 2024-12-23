import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_cohere import CohereEmbeddings
from pymongo import MongoClient
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
import re
load_dotenv()

class DocumentLoader:
    def __init__(self, chunk_size=1500, chunk_overlap=50, embedding_model="embed-english-light-v3.0"):
        """
        Initializes the DocumentLoader.

        Args:
            chunk_size (int): Size of text chunks for splitting. Default is 1500.
            chunk_overlap (int): Overlap size between chunks. Default is 50.
            embedding_model (str): Name of the embedding model to use. Default is 'embed-english-light-v3.0'.
        """
    
        
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
        self.embedding_model = embedding_model

    def embed_document(self,document_text):
        embeddings = CohereEmbeddings(model=self.embedding_model)
        return embeddings.embed_query(document_text)

    def store_in_vector_db(self, documentText,documentId, db_name="rag_db", collection_name="resume", index_name="resume_index"):
        documents=[]
        document = Document(page_content=documentText, metadata={"source": documentId})
        chunks = self.text_splitter.split_documents([document])  # Pass the document in a list
        documents.extend(chunks)

      
        embeddings = CohereEmbeddings(model=self.embedding_model)
        mongodb_uri = os.getenv("MONGODB_URI")
        client = MongoClient(mongodb_uri)
        collection = client[db_name][collection_name]

        vector_store = MongoDBAtlasVectorSearch.from_documents(
            documents=documents,
            embedding=embeddings,
            collection=collection,
            index_name=index_name
        )

        return vector_store
    def delete_documents_by_id(self,document_id, db_name="rag_db", collection_name="resume"):
        """
        Delete all documents in the MongoDB vector database that have a specific document ID in their metadata.

        :param document_id: The ID to match in the metadata's "source" field.
        :param db_name: The name of the database.
        :param collection_name: The name of the collection.
        """
        mongodb_uri = os.getenv("MONGODB_URI")
        if not mongodb_uri:
            raise ValueError("MONGODB_URI environment variable is not set.")

        client = MongoClient(mongodb_uri)
        collection = client[db_name][collection_name]

        # Delete documents where metadata.source matches the given document_id
        delete_result = collection.delete_many({"source": document_id})

        return delete_result.deleted_count
    def query_vector_db(self, query, db_name="rag_db", collection_name="resume", index_name="resume_index"):
        mongodb_uri = os.getenv("MONGODB_URI")
        if not mongodb_uri:
            raise ValueError("MONGODB_URI environment variable is not set.")

        client = MongoClient(mongodb_uri)
        collection = client[db_name][collection_name]

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
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
            # other params...
        )


        prompt = PromptTemplate.from_template("""
        Find the most suitable resume based on the following Job description in terms of experience. Explain why. 
        Return the anser in json format, with a field for metadata, and a field for explanation. The metadata field must only include document_id and source. Nothing else.
                                                                                    
        Job Description: {question}
        Context: {context}
        """)
        rag_chain = (
        { "context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
        )
        question = (
            str(query)
        )


        try:
            results = rag_chain.invoke(question)
            if results:
                # Parse and return the ID from the LLM's response
                print("LLM Response:", results)
                
                return {"response": results}
        except Exception as e:
            print(f"An error occurred: {e}")

        

