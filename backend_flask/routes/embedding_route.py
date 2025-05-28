from flask import Blueprint, request, jsonify
from services.face_processing import extract_face_embedding

embedding_bp = Blueprint(
    "embedding_bp",
    __name__,
    url_prefix="/api"
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