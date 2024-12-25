from flask import Flask, jsonify, request
from utils.document_loader import DocumentLoader

d = DocumentLoader()  # Initialize the DocumentLoader instance
app = Flask(__name__)

# Home route
@app.route('/')
def home():
    return "Welcome to the Flask server!"  # Simple welcome message

# API route for embedding text
@app.route('/api/embedText', methods=['POST'])
def api():
    data = request.get_json()  # Parse the incoming JSON data
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' field in the request body"}), 400  # Missing field error
    
    text = data['text']
    embedding = d.embed_document(text)  # Get the document embedding
    return jsonify({"embedding": embedding}), 200  # Return the embedding as JSON

# API route to add a document to the RAG database
@app.route('/api/add_document', methods=['POST'])
def add_document_to_rag_db():
    data = request.get_json()  # Parse the incoming JSON data
    document = data["document"]
    document_id = data["document_id"]
    try:
        d.store_in_vector_db(document, document_id)  # Store the document in the database
        return jsonify({'success': True, 'message': 'Document added successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e), 'document_id': document_id, 'document': document})

# API route to remove a document from the RAG database
@app.route('/api/remove_document', methods=['POST'])
def remove_document_from_rag_db():
    document_id = request.get_json()  # Parse the incoming JSON data
    document_id = document_id["document_id"]
    try:
        d.delete_documents_by_id(document_id)  # Delete the document by ID
        return jsonify({'success': True, 'message': 'Document removed successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# API route to query documents in the RAG database
@app.route('/api/query_documents', methods=['POST'])
def query_documents_in_rag_db():
    query = request.get_json()  # Parse the incoming JSON data
    query = query["query"]
    try:
        results = d.query_vector_db(query)  # Query the vector database
        return jsonify({'success': True, 'results': results})  # Return the query results
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
