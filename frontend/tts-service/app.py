from flask import Flask, request, send_file
from flask_cors import CORS
from gtts import gTTS
import os
import uuid
import base64
import cv2
import numpy as np
from deepface import DeepFace

app = Flask(__name__)
CORS(app)
from transformers import pipeline

emotion_classifier_text = pipeline(
    "text-classification",
    model="./models/emotion-model",
    tokenizer="./models/emotion-model",
    return_all_scores=True
)


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

@app.route("/api/expression", methods=["POST"])
def analyze_expression():
    data = request.get_json()
    image_base64 = data.get("image")

    try:
        img_data = base64.b64decode(image_base64)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        result = DeepFace.analyze(img, actions=["emotion"], enforce_detection=False)
        emotion = result[0]["dominant_emotion"]

        return {"emotion": emotion, "message": f"You seem {emotion}."}
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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005)
