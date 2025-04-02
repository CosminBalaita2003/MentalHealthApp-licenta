import { Audio } from "expo-av";
import { TTS_API_URL } from "@env";

let soundObject = null;

export const speakText = async (text, lang = "en") => {
  if (!text) return;

  // oprește orice redare activă
  if (soundObject) {
    try {
      await soundObject.stopAsync();
      await soundObject.unloadAsync();
    } catch {}
  }

  try {
    const response = await fetch(`${TTS_API_URL}/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang })
    });

    const { url } = await response.json();

    soundObject = new Audio.Sound();
    await soundObject.loadAsync({ uri: `${TTS_API_URL}${url}` });
    await soundObject.playAsync();
  } catch (error) {
    console.error("🗣️ TTS error:", error);
  }
};
export const speakTextAndWait = async (text, lang = "en") => {
  if (!text) return;

  if (soundObject) {
    try {
      await soundObject.stopAsync();
      await soundObject.unloadAsync();
    } catch {}
  }

  try {
    const response = await fetch(`${TTS_API_URL}/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
    });

    const { url } = await response.json();

    soundObject = new Audio.Sound();
    await soundObject.loadAsync({ uri: `${TTS_API_URL}${url}` });

    await soundObject.playAsync();
    await new Promise((resolve) => {
      soundObject.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          resolve();
        }
      });
    });

    await soundObject.unloadAsync();
  } catch (error) {
    console.error("🔈 TTS error:", error);
  }
};
export const stopTTS = async () => {
  if (soundObject) {
    try {
      await soundObject.stopAsync();
      await soundObject.unloadAsync();
      soundObject = null;
    } catch (e) {
      console.warn("⚠️ Failed to stop TTS:", e);
    }
  }
};