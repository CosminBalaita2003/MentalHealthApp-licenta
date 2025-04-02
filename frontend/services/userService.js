import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from '@env';

const userService = {
  /**
   * Login - Trimite email și parolă la backend și primește un token JWT.
   */
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/User/login`, { email, password });
      const token = response.data?.token || response.data?.Token;
  
      if (!token) {
        return { success: false, message: "Token-ul lipseste în răspuns!" };
      }
  
      await AsyncStorage.setItem("token", token);
      console.log(" Token saved:", token);
  
      // 👇 Fetch user info imediat după login
      const userResponse = await axios.get(`${API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const user = userResponse.data;
      console.log("User loaded after login:", user);
  
      await AsyncStorage.setItem("user", JSON.stringify(user)); // ✅ Salvăm user complet
      await AsyncStorage.setItem("userId", user.id); // optional fallback
  
      return { success: true, token, user };
    } catch (error) {
      console.error(" Login error:", error.response?.data || error.message);
      return { success: false, message: "Eroare la autentificare" };
    }
  }
  ,
  /**
   * Get User - Obține informațiile despre utilizatorul logat folosind token-ul JWT.
   */
  getUser: async () => {
    try {
      const token = await AsyncStorage.getItem("token"); //  Fix Here
      if (!token) {
        console.warn(" No token found!");
        return { success: false, message: "Utilizator neautentificat" };
      }

      console.log(" Fetching user with token:", token);

      const response = await axios.get(`${API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(" User fetched:", response.data);

      return { success: true, user: response.data };
    } catch (error) {
      console.error(" GetUser error:", error.response?.data || error.message);
      return { success: false, message: "Eroare la obținerea utilizatorului" };
    }
  },

  /**
   * Edit User - Permite utilizatorului să își editeze informațiile.
   */
  editUser: async (profile) => {
    try {
      const token = await AsyncStorage.getItem("token"); //  Fix Here
      if (!token) {
        return { success: false, message: "Utilizator neautentificat" };
      }

      console.log(" Sending edit request with token:", token);

      const profileData = {
        fullName: profile.fullName && typeof profile.fullName === "string" ? profile.fullName.trim() : "",
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString() : "",
        timeOfBirth: profile.timeOfBirth ? profile.timeOfBirth.toString() : "12:00:00",
        cityId: profile.cityId ? Number(profile.cityId) : 0,
        gender: profile.gender ? String(profile.gender).trim() : "",
        pronouns: profile.pronouns ? String(profile.pronouns).trim() : "",
        bio: profile.bio ? String(profile.bio).trim() : "",
      };

      console.log(" Sending data:", JSON.stringify(profileData, null, 2));

      const response = await axios.put(`${API_URL}/api/user/edit`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(" User updated:", response.data);

      return { success: true, message: response.data?.Message || "Datele au fost actualizate" };
    } catch (error) {
      console.error(" EditUser error:", error.response?.data || error.message);

      if (error.response) {
        console.log(" Full error response:", JSON.stringify(error.response.data, null, 2));
      }

      return { success: false, message: "Eroare la actualizarea datelor" };
    }
  },

  /**
   * Logout - Șterge token-ul din AsyncStorage.
   */
  logout: async () => {
    try {
      await AsyncStorage.removeItem("token"); //  Fix Here
      console.log(" Token removed");
    } catch (error) {
      console.error(" Logout error:", error.message);
    }
  },

  /**
 * Register - Trimite datele de înregistrare la backend.
 */
  register: async (userData) => {
    try {
      console.log(" Sending register request to:", `${API_URL}/api/User/register`);
      console.log(" With data:", userData);

      const response = await axios.post(`${API_URL}/api/User/register`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(" Registration response:", response.data);
      return { success: true, message: response.data?.Message || "User registered successfully!" };
    } catch (error) {
      console.error(" Register error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.Message || "Eroare la înregistrare" };
    }
  },

};

export default userService;
