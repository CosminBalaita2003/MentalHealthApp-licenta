import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";
import { fetchUserData } from "./authService";



/**
 * Fetch all journal entries for the authenticated user.
 */
export const fetchUserEntries = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    console.log(" Retrieved Auth Token in fetchUserEntries:", token);

    if (!token) {
      throw new Error(" No auth token found! User not authenticated.");
    }

    const response = await axios.get(`${API_URL}/api/JournalEntry/UserEntries`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // console.log(" Raw API Response:", JSON.stringify(response.data, null, 2));

    // 📌 Extract `$values` if the response has this structure
    const entriesArray = response.data?.$values ?? response.data;

// 📌 Construim un dicționar global de obiecte cu $id
const idMap = {};
entriesArray.forEach(item => {
  if (item?.$id) {
    idMap[item.$id] = item;
  }
});

// 📌 Rezolvare de referințe recursiv
const resolveRef = (ref) => {
  if (ref?.$ref && idMap[ref.$ref]) {
    return resolveRef(idMap[ref.$ref]); // dacă e referință către alt obiect, recursiv
  }
  return ref;
};

// 📌 Procesăm doar obiectele de tip JournalEntry (care au id)
const processedEntries = entriesArray
  .filter(entry => entry?.id && typeof entry === 'object')
  .map(entry => ({
    ...entry,
    emotion: resolveRef(entry.emotion),
  }));



  
    
    

    // console.log(" Processed Entries:", JSON.stringify(processedEntries, null, 2));

    return { success: true, entries: processedEntries };
  } catch (error) {
    // console.error(" Error fetching journal entries:", error.response?.data || error.message);
    return { success: false, message: "Failed to fetch journal entries" };
  }
};

export const addJournalEntry = async (content, emotionId, user) => {
  try {
    const token = await AsyncStorage.getItem("token");
    // console.log(" Retrieved Auth Token:", token);

    if (!token) {
      throw new Error(" No auth token found!");
    }

    // 📌 Construiește obiectul corect pentru `User.City`
    const userCity = {
      id: user.city?.id || 0,
      name: user.city?.name || "Unknown",
      nameAscii: user.city?.nameAscii || "Unknown",
      country: user.city?.country || "Unknown",
      iso2: user.city?.iso2 || "XX",
      iso3: user.city?.iso3 || "XXX",
      admin1: user.city?.admin1 || "Unknown",
      capital: user.city?.capital || "Unknown",
      lat: user.city?.lat || 0,
      lon: user.city?.lon || 0,
      pop: user.city?.pop || 0
    };

    // 📌 Construiește obiectul pentru `User`
    const userObject = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      bio: user.bio || "",
      pronouns: user.pronouns || "",
      gender: user.gender || "",
      createdAt: user.createdAt,
      city: userCity, //  Trimite un obiect complet City
      journalEntries: [] //  Array gol pentru a evita erori
    };

    // 📌 Construiește obiectul final pentru JournalEntry
    const requestBody = {
      id: 0, // Backend-ul așteaptă acest ID implicit
      content,
      date: new Date().toISOString(),
      emotionId, //  Trimitem doar ID-ul emoției, NU obiectul complet
      userId: user.id,
      user: userObject
    };

    // console.log(" Sending full data:", requestBody);

    const response = await axios.post(
      `${API_URL}/api/JournalEntry/add`,
      requestBody,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    // console.log(" Success:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Axios Error:", error.response?.data || error.message);
    throw error;
  }
};


export const fetchEmotions = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/Emotion`);

    // console.log(" Raw API Response:", response.data);

    // Dacă backend-ul returnează $values, extragem doar acel array
    const emotionsArray = response.data?.$values ?? response.data;

    // console.log(" Extracted Emotions:", emotionsArray);

    return { success: true, emotions: emotionsArray };
  } catch (error) {
    // console.error(" Error fetching emotions:", error);
    return { success: false, emotions: [] };
  }
};

export const updateJournalEntry = async (entry, user) => {
  try {
    const token = await AsyncStorage.getItem("token");
    // console.log(" Retrieved Auth Token:", token);

    if (!token) {
      throw new Error(" No auth token found!");
    }

    // 📌 Construim `user.city` din `user.city` SAU `user.cityId` + `user.cityName`
    const userCity = {
      id: user.city?.id || 0,
      name: user.city?.name || "Unknown",
      nameAscii: user.city?.nameAscii || "Unknown",
      country: user.city?.country || "Unknown",
      iso2: user.city?.iso2 || "XX",
      iso3: user.city?.iso3 || "XXX",
      admin1: user.city?.admin1 || "Unknown",
      capital: user.city?.capital || "Unknown",
      lat: user.city?.lat || 0,
      lon: user.city?.lon || 0,
      pop: user.city?.pop || 0
    };
  


    // 📌 Construim user complet
    const userObject = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      bio: user.bio || "",
      pronouns: user.pronouns || "",
      gender: user.gender || "",
      createdAt: user.createdAt,
      city: userCity,
      journalEntries: [],
    };

    // 📌 Construim corpul requestului
    const requestBody = {
      ...entry,
      userId: user.id,
      user: userObject,
      emotionId: entry.emotionId,
      content: entry.content,
      date: entry.date,
    };

    // console.log("Updating entry:", requestBody);

    const response = await axios.put(
      `${API_URL}/api/JournalEntry/${entry.id}`,
      requestBody,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    // console.log("Update success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating journal entry:", error.response?.data || error.message);
    throw error;
  }
};
