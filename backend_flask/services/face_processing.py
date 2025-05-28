from PIL import Image
import torch
from facenet_pytorch import MTCNN, InceptionResnetV1

device = "cuda" if torch.cuda.is_available() else "cpu"
mtcnn = MTCNN(image_size=160, margin=0, keep_all=False, device=device)
resnet = InceptionResnetV1(pretrained="vggface2").eval().to(device)

def extract_face_embedding(file_storage):
    """
    :param file_storage: werkzeug FileStorage
    :returns: (list_of_floats, None) or (None, error_message)
    """
    try:
        img = Image.open(file_storage.stream).convert("RGB")
        face = mtcnn(img)
        if face is None:
            return None, "No face detected"
        face = face.unsqueeze(0).to(device)
        emb = resnet(face).detach().cpu().numpy().flatten().tolist()
        return emb, None
    except Exception as ex:
        return None, str(ex)