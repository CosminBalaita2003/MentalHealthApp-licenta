import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

export const saveProgress = async (exerciseId, user) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("No auth token found!");

    console.log("📤 Saving progress for user:", user?.id);
    console.log("👤 User String:", JSON.stringify(user));

    const progressObject = {
      id: 0,
      exerciseId, // doar id-ul
      userId: user.id, // doar id-ul
      date: new Date().toISOString(), // va fi suprascris de backend
    };

    console.log("📦 Progress payload:", JSON.stringify(progressObject, null, 2));

    const response = await axios.post(`${API_URL}/api/Progress`, progressObject, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

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

