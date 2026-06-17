from flask import jsonify
import requests
import os

_env = os.getenv("ENVIRONMENT", "development")

if _env == "production":
    FLASK_EMBEDDING_URL = "https://hydraone-flask-backend.onrender.com"
else:
    FLASK_EMBEDDING_URL = os.getenv("FLASK_EMBEDDING_SERVICE_URL", "http://127.0.0.1:5001")

def handle_extract_live_embedding(request):
    if "image" not in request.files:
        return jsonify({"error": "No live image frame provided"}), 400

    try:
        file = request.files["image"]
        image_bytes = file.read()

        response = requests.post(
            f"{FLASK_EMBEDDING_URL}/extract-embedding",
            files={"image": (file.filename, image_bytes, file.content_type)},
            timeout=15
        )

        if response.status_code != 200:
            error_msg = response.json().get("error", "Embedding extraction failed")
            return jsonify({"error": error_msg}), response.status_code

        data = response.json()
        embedding = data.get("embedding")

        if not embedding:
            return jsonify({"error": "No embedding returned"}), 400

        return jsonify({"embedding": embedding}), 200

    except requests.exceptions.Timeout:
        return jsonify({"error": "Embedding service timed out"}), 504
    except Exception as e:
        return jsonify({"error": str(e)}), 500