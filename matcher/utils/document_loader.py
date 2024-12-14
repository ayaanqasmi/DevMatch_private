import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_cohere import CohereEmbeddings
from pymongo import MongoClient
from dotenv import load_dotenv
from utils.extractpdf import extract_text_from_pdf

class DocumentLoader:
    def __init__(self, resumes_dir, chunk_size=1500, chunk_overlap=50, embedding_model="embed-english-light-v3.0"):
        """
        Initializes the DocumentLoader.

        Args:
            resumes_dir (str): Path to the directory containing resume PDF files.
            chunk_size (int): Size of text chunks for splitting. Default is 1500.
            chunk_overlap (int): Overlap size between chunks. Default is 50.
            embedding_model (str): Name of the embedding model to use. Default is 'embed-english-light-v3.0'.
        """
        if not os.path.exists(resumes_dir):
            raise FileNotFoundError(f"The directory {resumes_dir} does not exist. Please check the path.")
        
        self.resumes_dir = resumes_dir
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
        self.embedding_model = embedding_model

    def load_documents(self,resume_files):
        """
        Loads and processes resumes from the specified directory.

        Returns:
            List[Document]: List of processed and split Document objects.
        """
       
        documents = []

        for resume_file in resume_files:
            file_path = os.path.join(self.resumes_dir, resume_file)
            document_text = extract_text_from_pdf(file_path)
            document = Document(page_content=document_text, metadata={"source": resume_file})
            chunks = self.text_splitter.split_documents([document])
            documents.extend(chunks)

        return documents

    def store_in_vector_db(self, documents, mongodb_uri, db_name="rag_db", collection_name="embedded_resumes", index_name="resume_index"):
        """
        Embeds documents and stores them in a MongoDB Atlas Vector Search.

        Args:
            documents (List[Document]): List of Document objects to store.
            mongodb_uri (str): MongoDB connection URI.
            db_name (str): Name of the database. Default is 'rag_db'.
            collection_name (str): Name of the collection. Default is 'embedded_resumes'.
            index_name (str): Name of the vector search index. Default is 'resume_index'.

        Returns:
            MongoDBAtlasVectorSearch: Configured vector store instance.
        """
        embeddings = CohereEmbeddings(model=self.embedding_model)
        client = MongoClient(mongodb_uri)
        collection = client[db_name][collection_name]

        vector_store = MongoDBAtlasVectorSearch.from_documents(
            documents=documents,
            embedding=embeddings,
            collection=collection,
            index_name=index_name
        )

        return vector_store

# Example usage
if __name__ == "__main__":
    load_dotenv()
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    resumes_dir = os.path.join(current_dir, "INFORMATION-TECHNOLOGY")

    loader = DocumentLoader(resumes_dir)
    documents = loader.load_documents()

    mongodb_uri = os.getenv("MONGODB_URI")
    vector_store = loader.store_in_vector_db(documents, mongodb_uri)

    print("Documents processed and stored successfully.")
