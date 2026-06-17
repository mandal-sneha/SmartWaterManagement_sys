import io
import cv2
import numpy as np
from PIL import Image

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

EMBEDDING_DIM = 512

def _bytes_to_bgr(image_bytes):
    arr = np.frombuffer(image_bytes, np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)


def _detect_face(img_bgr):
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(30, 30))
    if len(faces) == 0:
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=2, minSize=(20, 20))
    if len(faces) == 0:
        return None
    x, y, w, h = max(faces, key=lambda r: r[2] * r[3])
    return gray[y:y+h, x:x+w]


def _lbp(gray):
    h, w = gray.shape
    g = gray.astype(np.float32)
    lbp = np.zeros((h, w), dtype=np.uint8)
    offsets = [(-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1)]
    for k, (dy, dx) in enumerate(offsets):
        r = np.clip(np.arange(h)[:, None] + dy, 0, h - 1)
        c = np.clip(np.arange(w)[None, :] + dx, 0, w - 1)
        lbp += ((g[r, c] >= g).astype(np.uint8)) << k
    return lbp


def _face_to_embedding(face_gray):
    resized = cv2.resize(face_gray, (64, 64))
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    normalized = clahe.apply(resized)
    lbp = _lbp(normalized)
    cell_h = 8
    cell_w = 8
    hists = []
    for i in range(8):
        for j in range(8):
            cell = lbp[i * cell_h:(i + 1) * cell_h, j * cell_w:(j + 1) * cell_w]
            hist, _ = np.histogram(cell, bins=8, range=(0, 256))
            hist = hist.astype(np.float32)
            total = hist.sum()
            if total > 0:
                hist /= total
            hists.append(hist)
    embedding = np.concatenate(hists)
    norm = np.linalg.norm(embedding)
    if norm > 0:
        embedding /= norm
    return embedding.tolist()


def extract_face_embedding(image_bytes):
    try:
        img_bgr = _bytes_to_bgr(image_bytes)
        if img_bgr is None:
            return None, "Could not decode image"
        face_roi = _detect_face(img_bgr)
        if face_roi is None:
            return None, "No face detected"
        embedding = _face_to_embedding(face_roi)
        return embedding, None
    except Exception as ex:
        return None, str(ex)


def compare_face_embeddings(image_bytes, stored_embedding):
    try:
        current_embedding, error = extract_face_embedding(image_bytes)
        if error:
            return None, error
        stored_arr = np.array(stored_embedding, dtype=np.float32)
        current_arr = np.array(current_embedding, dtype=np.float32)
        if stored_arr.shape[0] != current_arr.shape[0]:
            return None, f"Dimension mismatch: stored={stored_arr.shape[0]}, current={current_arr.shape[0]}. Re-register the user."
        score = float(np.dot(stored_arr, current_arr))
        return score, None
    except Exception as ex:
        return None, str(ex)