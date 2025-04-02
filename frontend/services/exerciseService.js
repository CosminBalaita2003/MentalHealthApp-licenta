import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

const getAllExercises = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/Exercise`);
    console.log("Raw Exercise Data:", response.data);
    return response.data;
  } catch (error) {
    console.log("Failed to fetch exercises", error);
    return [];
  }
};

const getExerciseById = async (id) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await axios.get(`${API_URL}/api/Exercise/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`❌ Failed to fetch exercise with ID ${id}`, error.response?.data || error.message);
    throw error;
  }
};

export default {
  getAllExercises,
  getExerciseById, 
};
