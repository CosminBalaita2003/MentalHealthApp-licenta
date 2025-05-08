import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

export const saveProgress = async (exerciseId, user) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("No auth token found!");

    console.log("📤 Saving progress for user:", user?.id);

    const progressObject = {
      id: 0,
      exerciseId,
      userId: user.id,
      date: new Date().toISOString(),
    };

    const response = await axios.post(`${API_URL}/api/Progress`, progressObject, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    // 🔁 Regenerăm promptul automat după ce progresul e salvat

    return response.data;
  } catch (error) {
    console.error("❌ Error saving progress:", error.response?.data || error.message);
    throw error;
  }
};


export const getAllProgress = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No auth token found!");
  
      const response = await axios.get(`${API_URL}/api/Progress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch progress data:", error.response?.data || error.message);
      throw error;
    }
  };

  export const getUserProgress = async (userId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No auth token found!");
  
      const response = await axios.get(`${API_URL}/api/Progress/UserProgress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch user's progress:", error.response?.data || error.message);
      throw error;
    }
  };
  

