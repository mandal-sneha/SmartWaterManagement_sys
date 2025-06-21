from flask import Blueprint, request, jsonify
from services.face_processing import extract_face_embedding, compare_face_embeddings

embedding_bp = Blueprint(
    "embedding_bp",
    __name__
)

@embedding_bp.route("/extract-embedding", methods=["POST"])
def extract_embedding():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]
    embedding, err = extract_face_embedding(file)
    if err:
        return jsonify({"error": err}), 400

    return jsonify({"embedding": embedding}), 200

@embedding_bp.route("/compare-faces", methods=["POST"])
def compare_faces():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    if "stored_embedding" not in request.form:
        return jsonify({"error": "No stored embedding provided"}), 400
    
    try:
        file = request.files["image"]
        stored_embedding = eval(request.form["stored_embedding"])
        
        similarity_score, error = compare_face_embeddings(file, stored_embedding)
        if error:
            return jsonify({"error": error}), 400
        
        return jsonify({"similarity_score": similarity_score}), 200
    
    except Exception as ex:
        return jsonify({"error": str(ex)}), 400