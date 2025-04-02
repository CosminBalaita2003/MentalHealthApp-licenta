from flask import Flask, request, send_file
from gtts import gTTS
import os
import uuid

app = Flask(__name__)
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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005)
