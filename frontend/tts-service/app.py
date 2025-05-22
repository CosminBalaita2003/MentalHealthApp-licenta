from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from gtts import gTTS
import os
import uuid
import base64
import cv2
import numpy as np
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Dropout, Flatten, Dense
import sys
import subprocess

from PIL import Image
from io import BytesIO
from ml_recommender import recommend_for_user  

app = Flask(__name__)
CORS(app)
from transformers import pipeline

emotion_classifier_text = pipeline(
    "text-classification",
    model="./models/emotion-model",
    tokenizer="./models/emotion-model",
    return_all_scores=True
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "facial-emotion", "model.h5")
def run_script(script_name):
    """
    Rulează script-ul Python din BASE_DIR și ridică CalledProcessError dacă există eroare.
    """
    python_bin = sys.executable
    script_path = os.path.join(BASE_DIR, script_name)
    result = subprocess.run(
        [python_bin, script_path],
        cwd=BASE_DIR,
        capture_output=True,
        text=True,
        check=True
    )
    print(f"=== {script_name} output ===\n{result.stdout}")
    return result 

emotion_model = Sequential()
emotion_model.add(Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(48, 48, 1)))
emotion_model.add(Conv2D(64, kernel_size=(3, 3), activation='relu'))
emotion_model.add(MaxPooling2D(pool_size=(2, 2)))
emotion_model.add(Dropout(0.25))
emotion_model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
emotion_model.add(MaxPooling2D(pool_size=(2, 2)))
emotion_model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
emotion_model.add(MaxPooling2D(pool_size=(2, 2)))
emotion_model.add(Dropout(0.25))
emotion_model.add(Flatten())
emotion_model.add(Dense(1024, activation='relu'))
emotion_model.add(Dropout(0.5))
emotion_model.add(Dense(7, activation='softmax'))

emotion_model.load_weights(MODEL_PATH)


emotion_dict = {
    0: "Angry", 1: "Disgusted", 2: "Fearful",
    3: "Happy", 4: "Neutral", 5: "Sad", 6: "Surprised"
}



OUTPUT_DIR = "tts_output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.route("/api/tts", methods=["POST"])
def text_to_speech():
    data = request.get_json()
    text = data.get("text", "")
    lang = data.get("lang", "en")

    if not text:
        return {"error": "No text provided"}, 400

    filename = f"{uuid.uuid4()}.mp3"
    filepath = os.path.join(OUTPUT_DIR, filename)

    tts = gTTS(text=text, lang=lang)
    tts.save(filepath)

    return {"url": f"/api/tts/audio/{filename}"}

@app.route("/api/tts/audio/<filename>")
def get_audio(filename):
    filepath = os.path.join(OUTPUT_DIR, filename)
    return send_file(filepath, mimetype="audio/mpeg")

# @app.route("/api/expression", methods=["POST"])
# def analyze_expression():
#     data = request.get_json()
#     image_base64 = data.get("image")

#     try:
#         img_data = base64.b64decode(image_base64)
#         nparr = np.frombuffer(img_data, np.uint8)
#         img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#         result = DeepFace.analyze(img, actions=["emotion"], enforce_detection=False)
#         emotion = result[0]["dominant_emotion"]

#         return {"emotion": emotion, "message": f"You seem {emotion}."}
#     except Exception as e:
#         return {"error": str(e)}, 500
@app.route("/api/expression", methods=["POST"])
def analyze_expression():
    data = request.get_json()
    image_base64 = data.get("image")

    try:
        img_data = base64.b64decode(image_base64)
        nparr = np.frombuffer(img_data, np.uint8)
        img_cv = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Detectează fața
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

        if len(faces) == 0:
            return {"emotion": "Neutral", "message": "No face detected, assuming neutral."}

        x, y, w, h = faces[0]  # doar prima față
        face_img = gray[y:y+h, x:x+w]
        face_img = cv2.resize(face_img, (48, 48))
        face_array = face_img.reshape(1, 48, 48, 1).astype("float32") / 255.0

        prediction = emotion_model.predict(face_array)
        predicted_label = emotion_dict[np.argmax(prediction)]

        return {"emotion": predicted_label, "message": f"You seem {predicted_label}."}

    except Exception as e:
        return {"error": str(e)}, 500
    
@app.route("/api/text-emotion", methods=["POST"])
def analyze_text_emotion():
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return {"error": "No text provided"}, 400

    try:
        results = emotion_classifier_text(text)[0]
        dominant = max(results, key=lambda r: r["score"])

        return {
            "dominantEmotion": dominant["label"],
            "scores": {r["label"]: round(r["score"], 3) for r in results},
            "message": f"You seem to feel {dominant['label']}."
        }
    except Exception as e:
        return {"error": str(e)}, 500



@app.route("/api/update-and-train", methods=["POST"])
def update_and_train():
    """
    1) Rulează sync_progress.py pentru a aduce ultimul progres din baza de date
    2) Rulează train_recommender.py pentru a re-antrena modelul pe CSV-ul actualizat
    """
    try:
        # 1) sincronizare CSV
        run_script("sync_progress.py")

        # 2) training modele
        run_script("train_model.py")

        return jsonify({"status": "ok", "message": "Data synced and model retrained"}), 200

    except subprocess.CalledProcessError as e:
        # dacă oricare script a eșuat
        print(f"❌ Error running script: {e.stderr}")
        return jsonify({
            "error": f"Script failed: {e.cmd[-1]}",
            "details": e.stderr
        }), 500



@app.route("/api/recommend/<user_id>", methods=["GET"])
def get_recommendation(user_id):
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing or invalid Authorization header"}), 401
    # citim parametrul k, default 10
    k = request.args.get("k", default=10, type=int)

    try:
        # recs e o listă de (id, score) de lungime k
        recs = recommend_for_user(user_id, k=k)
        if not recs:
            return jsonify({"error": "No recommendations available"}), 404

        # extragem doar ID-urile și le forțăm la int
        exercise_ids = [int(r[0]) if isinstance(r, (list, tuple)) else int(r)
                        for r in recs]

        return jsonify({ "exerciseIds": exercise_ids })
    except KeyError as ke:
        return jsonify({"error": str(ke)}), 404
    except Exception as e:
        print("⚠️ Error in get_recommendation:", e)
        return jsonify({"error": str(e)}), 500
    


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005)
