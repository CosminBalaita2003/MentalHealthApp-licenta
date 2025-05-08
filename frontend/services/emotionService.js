import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveDetectedEmotion = async ({ emotionName, sentence, source, journalEntryId }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
  
      const emotionData = {
        emotionName,
        sentence,
        source,
        journalEntryId, // ✅ nou
        userId: user.id,
        timestamp: new Date().toISOString()
      };
  
      const response = await axios.post(`${API_URL}/api/detected-emotion/save`, emotionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      return response.data;
    } catch (err) {
      console.error("❌ Failed to save detected emotion:", err.response?.data || err.message);
    }
  };
  