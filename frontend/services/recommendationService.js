import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { TTS_API_URL } from "@env";

const getRecommendations = async (userId, k = 10) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No auth token found!");

  // cerem top k de la backend
  const res = await axios.get(
    `${TTS_API_URL}/api/recommend/${userId}?k=${k}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  // avem acum { exerciseIds: [id1, id2, …] }
  return res.data.exerciseIds;
};

export default { getRecommendations };
