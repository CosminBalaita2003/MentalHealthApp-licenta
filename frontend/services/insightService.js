import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { fetchEmotions } from "./journalService";
import moment from "moment-timezone";

export const fetchEmotionInsightVectors = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userString = await AsyncStorage.getItem("user");
    const user = JSON.parse(userString);
    const today = moment().tz("Europe/Bucharest").format("YYYY-MM-DD");

    if (!token || !user) return null;

    // 🔹 1. Fetch all detected emotions
    const emotionRes = await axios.get(`${API_URL}/api/detected-emotion/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const allDetected = emotionRes.data ?? [];

    // 🔹 2. Filter only today's
    const todayEmotions = allDetected.filter(e => e.timestamp?.startsWith(today));

    const journalEmotions = todayEmotions.filter(e => e.source === "journal");
    const breathingEmotions = todayEmotions.filter(e => e.source === "breathing");

    // 🔹 3. Fetch all journals (to get emotionId)
    const journalRes = await axios.get(`${API_URL}/api/JournalEntry/UserEntries`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const journals = journalRes.data?.$values ?? journalRes.data;

    // 🔹 4. Fetch all emotion names
    const emotionsResponse = await fetchEmotions();
    const emotionsList = emotionsResponse.success ? emotionsResponse.emotions : [];

    const getEmotionNameById = (id) => emotionsList.find(e => e.id === id)?.name ?? "unknown";

    // 🔹 5. Build vectors

    const declaredByUser = [];
    const detectedFromJournal = journalEmotions.map(e => e.emotionName);
    const detectedFromBreathing = breathingEmotions.map(e => e.emotionName);

    // 🔹 6. For each journalId in journalEmotions, get emotionId
    const uniqueJournalIds = [...new Set(journalEmotions.map(e => e.journalEntryId))];

    for (const jid of uniqueJournalIds) {
      const entry = journals.find(j => j.id === jid);
      if (entry && entry.emotionId) {
        const emotionName = getEmotionNameById(entry.emotionId);
        declaredByUser.push(emotionName);
      }
    }

    return {
      declaredByUser,
      detectedFromJournal,
      detectedFromBreathing,
    };
  } catch (error) {
    console.error("❌ Error in fetchEmotionInsightVectors:", error.response?.data || error.message);
    return null;
  }
};
