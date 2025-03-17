import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from '@env';

const testService = {
  /**
   * Get User Tests - Obține testele unui utilizator după `userId`.
   */
  getUserTests: async (userId) => {
    try {
      console.log("🔹 Fetching tests for user:", userId);
  
      const response = await axios.get(`${API_URL}/api/tests/${userId}`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      });
  
      console.log("📊 Raw Test Data:", response.data);
  
      // 🔹 Verificăm dacă datele conțin `$values`
      const testsArray = response.data?.$values || [];
  
      console.log("✅ Processed Test Data:", testsArray);
      return { success: true, tests: testsArray };
    } catch (error) {
      console.error("❌ Error fetching user tests:", error.response?.data || error.message);
      return { success: false, message: "Eroare la obținerea testelor utilizatorului" };
    }
  },
  
};

export default testService;
