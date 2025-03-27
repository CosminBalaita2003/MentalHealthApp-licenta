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

export default {
  getAllExercises,
};
