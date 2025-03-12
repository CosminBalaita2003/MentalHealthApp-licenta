import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const userService = {
  /**
   * Login - Trimite email și parolă la backend și primește un token JWT.
   */
  login: async (email, password) => {
    try {
      console.log("🔹 Sending login request to:", `${API_URL}/api/User/login`);
      console.log("🔹 With data:", { email, password });

      const response = await axios.post(`${API_URL}/api/User/login`, { email, password });

      console.log("✅ Response from backend:", response.data);

      const token = response.data?.token || response.data?.Token;
      if (!token) {
        console.error("❌ Token missing in response!");
        return { success: false, message: "Token-ul lipseste în răspuns!" };
      }

      await AsyncStorage.setItem('token', token);
      console.log("✅ Token saved:", token);

      return { success: true, token };
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.Message || 'Eroare la autentificare' };
    }
  },

  /**
   * Get User - Obține informațiile despre utilizatorul logat folosind token-ul JWT.
   */
  getUser: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn("❌ No token found!");
        return { success: false, message: 'Utilizator neautentificat' };
      }

      console.log("🔹 Fetching user with token:", token);

      const response = await axios.get(`${API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ User fetched:", response.data);

      return { success: true, user: response.data };
    } catch (error) {
      console.error("❌ GetUser error:", error.response?.data || error.message);
      return { success: false, message: 'Eroare la obținerea utilizatorului' };
    }
  },

  /**
   * Edit User - Permite utilizatorului să își editeze informațiile.
   */
  editUser: async (profile) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'Utilizator neautentificat' };
        }

        console.log("🔹 Sending edit request with token:", token);

        // 🔹 Convertim și ne asigurăm că toate câmpurile sunt corect tipizate
        const profileData = {
            fullName: profile.fullName && typeof profile.fullName === "string" ? profile.fullName.trim() : "",
            dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString() : "",
            timeOfBirth: profile.timeOfBirth ? profile.timeOfBirth.toString() : "12:00:00",
            cityId: profile.cityId ? Number(profile.cityId) : 0,
            gender: profile.gender ? String(profile.gender).trim() : "",
            pronouns: profile.pronouns ? String(profile.pronouns).trim() : "",
            bio: profile.bio ? String(profile.bio).trim() : "",
        };

        console.log("🔹 Tipul fullName:", typeof profileData.fullName, "| Valoare:", profileData.fullName);
        console.log("🔹 Tipul cityId:", typeof profileData.cityId, "| Valoare:", profileData.cityId);
        console.log("🔹 Payload final trimis la backend:", JSON.stringify(profileData, null, 2));

        const response = await axios.put(`${API_URL}/api/user/edit`, profileData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("✅ User updated:", response.data);

        return { success: true, message: response.data?.Message || 'Datele au fost actualizate' };
    } catch (error) {
        console.error("❌ EditUser error:", error.response?.data || error.message);

        // 🔹 Logăm răspunsul complet pentru debugging
        if (error.response) {
            console.log("❌ Răspuns complet de eroare:", JSON.stringify(error.response.data, null, 2));
        }

        return { success: false, message: 'Eroare la actualizarea datelor' };
    }
},



};

export default userService;
