from utils.document_loader import DocumentLoader

d=DocumentLoader()

embedding1=d.embed_document("My name is Ayaan. I am good at Football")
embedding2=d.embed_document("I'm Ayaan and I love soccer")


import numpy as np

# Example embeddings (vectors)
embedding1 = np.array(embedding1)
embedding2 = np.array(embedding2)   

# Calculate dot product
dot_product = np.dot(embedding1, embedding2)

# Calculate magnitudes (norms) of the embeddings
norm1 = np.linalg.norm(embedding1)
norm2 = np.linalg.norm(embedding2)

# Calculate cosine similarity
cosine_similarity = dot_product / (norm1 * norm2)

print("Cosine Similarity:", cosine_similarity)