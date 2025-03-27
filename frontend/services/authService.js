import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from '@env';
import axios from "axios";


export const fetchUserData = async (setIsAuthenticated) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.log(" No token found. Staying unauthenticated.");
      setIsAuthenticated(false);
      return null;
    }

    console.log(" Token found, verifying authentication...");

    const response = await axios.get(`${API_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(" User authenticated:", response.data);

    if (response.data.id) {
      await AsyncStorage.setItem("userId", response.data.id);
      console.log(" Saved userId in AsyncStorage:", response.data.id);
    } else {
      console.log(" No userId in response! Authentication might be failing.");
      return null;
    }

    setIsAuthenticated(true);
    return response.data;
  } catch (error) {
    console.log(" Authentication check failed:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      setIsAuthenticated(false);
    }

    return null;
  }
};

