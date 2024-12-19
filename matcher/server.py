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
    
        

# Sample POST route
@app.route('/api/embed/document', methods=['POST'])
def post_data():
    data = request.get_json()
    # Do something with the data (e.g., save to database)
    return jsonify({'received': data}), 201

if __name__ == '__main__':
    app.run(debug=True)
