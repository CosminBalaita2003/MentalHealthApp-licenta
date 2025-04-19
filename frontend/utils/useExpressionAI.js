import { TTS_API_URL } from "@env";

// am scos importul de la speakText

export const analyzeExpressionFromBase64 = async (base64Image, callback = null) => {
  try {
    const response = await fetch(`${TTS_API_URL}/api/expression`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image }),
    });

    const data = await response.json();

    if (data.message) {
      console.log("🧠 Detected:", data.message);
      
      // am scos speakText(data.message);

      if (callback) callback(data);
    } else if (data.error) {
      console.warn("⚠️ AI response error:", data.error);
    }
  } catch (err) {
    console.error("❌ Expression analysis failed:", err);
  }
};
