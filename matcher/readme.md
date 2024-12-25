API Endpoints
POST /api/embedText - Embeds text by providing the text to be embedded in the request body.
Request body: {"text": "your text here"}

POST /api/add_document - Adds a document to the RAG (retrieval-augmented generation) database by providing the document content and its ID in the request body.
Request body: {"document": "document content", "document_id": "unique_document_id"}

POST /api/remove_document - Removes a document from the RAG database by providing the document's ID in the request body.
Request body: {"document_id": "unique_document_id"}

POST /api/query_documents - Queries the RAG database for documents based on the provided query.
Request body: {"query": "your search query here"}