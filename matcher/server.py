from flask import Flask, jsonify, request
from utils.document_loader import DocumentLoader
d=DocumentLoader()
app = Flask(__name__)

# Home route
@app.route('/')
def home():
    return "Welcome to the Flask server!"

# Sample API route
@app.route('/api/embedText', methods=['POST'])
def api():
     
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' field in the request body"}), 400
    
    text = data['text']
    embdedding=d.embed_document(text)
    return jsonify({"embedding": embdedding}), 200
    
        

@app.route('/api/add_document', methods=['POST'])
def add_document_to_rag_db():
    data = request.get_json()
    document=data["document"]
    document_id=data["document_id"]
    print(document,document_id)
    try:
        d.store_in_vector_db(document,document_id)
        return jsonify({'success': True, 'message': 'Document added successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e),'document_id':document_id,'document':document})

@app.route('/api/remove_document', methods=['POST'])
def remove_document_from_rag_db():
    document_id=request.get_json()
    document_id=document_id["document_id"]
    try:
        d.delete_documents_by_id(document_id)
        return jsonify({'success': True, 'message': 'Document removed successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/query_documents', methods=['POST'])
def query_documents_in_rag_db():
    query = request.get_json()
    query=query["query"]
    try:
        results = d.query_vector_db(query)
        return jsonify({'success': True, 'results': results})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})
if __name__ == '__main__':
    app.run(debug=True)
