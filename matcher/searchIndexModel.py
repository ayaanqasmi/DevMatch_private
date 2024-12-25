from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from a .env file
load_dotenv()

# Initialize MongoDB client using the URI from environment variables
client = MongoClient(os.getenv("MONGODB_URI"))
collection = client["rag_db"]["resume"]  # Access the 'resume' collection

# Define a search index model for vector search
search_index_model = SearchIndexModel(
  definition = {
    "fields": [
      {
        "type": "vector",  # Define the field type as 'vector'
        "numDimensions": 384,  # Number of dimensions of the vector
        "path": "embedding",  # The field to store the vector
        "similarity": "cosine"  # Use cosine similarity for vector comparison
      }
    ]
  },
  name = "resume_index",  # Name of the index
  type = "vectorSearch"  # Type of search (vector search)
)

# Create the search index in the MongoDB collection
collection.create_search_index(model=search_index_model)
