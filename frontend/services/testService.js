import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from '@env';

const testService = {
  /**
   * Get User Tests - Obține testele unui utilizator după `userId`.
   */
  getUserTests: async (userId) => {
    try {
      // console.log(" Fetching tests for user:", userId);

      const response = await axios.get(`${API_URL}/api/tests/${userId}`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      });

      // console.log(" Raw Test Data:", response.data);

      const testsArray = Array.isArray(response.data)
  ? response.data
  : response.data?.$values || [];


      // console.log("Processed Test Data:", testsArray);
      return { success: true, tests: testsArray };
    } catch (error) {
      // console.log("Error fetching user tests:", error.response?.data || error.message);
      return { success: false, message: "Eroare la obținerea testelor utilizatorului" };
    }
  },

};
/**
 * Returnează un rezumat cu:
 * - ultimul test
 * - scor mediu
 * - interpretare
 * pentru fiecare tip de test.
 */
export const getUserTestSummaries = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    const response = await axios.get(`${API_URL}/api/tests/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const allTests = Array.isArray(response.data)
      ? response.data
      : response.data?.$values || [];

    const testTypes = ["GAD-7", "PHQ-9", "PSS-10"];
    const summaries = {};

    for (const type of testTypes) {
      const filtered = allTests
        .filter((t) => t.testType === type)
        .sort((a, b) => new Date(b.testDate) - new Date(a.testDate)); // descrescător

      if (filtered.length === 0) continue;

      const scores = filtered.map((t) => t.score);
      const latest = filtered[0];
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

      summaries[type] = {
        latestScore: latest.score,
        latestDate: latest.testDate,
        latestInterpretation: interpretResults(type, latest.score),
        averageScore: avg,
        averageInterpretation: interpretResults(type, avg),
      };
    }

    return { success: true, summaries };
  } catch (err) {
    console.error("❌ Error fetching test summaries:", err.response?.data || err.message);
    return { success: false, summaries: {} };
  }
};

// Helper pentru interpretare
export const interpretResults = (testType, score) => {
  if (testType === "GAD-7") {
    if (score <= 4) return "Minimal Anxiety";
    if (score <= 9) return "Mild Anxiety";
    if (score <= 14) return "Moderate Anxiety";
    return "Severe Anxiety";
  } else if (testType === "PSS-10") {
    if (score <= 13) return "Low Stress";
    if (score <= 26) return "Moderate Stress";
    return "High Stress";
  } else if (testType === "PHQ-9") {
    if (score <= 4) return "Minimal Depression";
    if (score <= 9) return "Mild Depression";
    if (score <= 14) return "Moderate Depression";
    if (score <= 19) return "Moderately Severe Depression";
    return "Severe Depression";
  }
};

export default testService;
