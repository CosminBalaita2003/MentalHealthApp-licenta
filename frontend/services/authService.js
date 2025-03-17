import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchUserData = async (setIsAuthenticated) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.log("❌ No token found. Staying unauthenticated.");
      return null; // ⚠️ Nu setăm `false`, doar returnăm null
    }

    const response = await fetch(`${process.env.API_URL}/api/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      if (response.status === 401) { // Token invalid
        console.error("❌ Authentication failed. Clearing token.");
        await AsyncStorage.removeItem("token");
        setIsAuthenticated(false);
      }
      return null;
    }

    const data = await response.json();
    console.log("✅ User authenticated:", data);
    setIsAuthenticated(true);
    return data;
  } catch (error) {
    console.error("❌ Error fetching user data:", error.message);
    return null; // ⚠️ Nu delogăm utilizatorul pe erori temporare
  }
};
