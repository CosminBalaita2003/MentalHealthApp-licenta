import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import exerciseService from "../services/exerciseService";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "../styles/exerciseScreenStyles";
import recommendationService from "../services/recommendationService";
import ExerciseModal from "../components/ExerciseModal";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import { TTS_API_URL } from "@env";

const ExercisesScreen = () => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const [recLoading, setRecLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [recommendedExercise, setRecommendedExercise] = useState(null);
  const iconMap = {
  "Breathing": "leaf-outline",
  "Meditation & Mindfulness": "flower-outline",
  "Progressive Muscle Relaxation": "body-outline",
  "Emotional Regulation Exercises": "happy-outline",
  "Visualization Techniques": "eye-outline",
  "Stress Management Techniques": "pulse-outline",
  "Unknown": "help-circle-outline"
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allExercises = await exerciseService.getAllExercises();
        // console.log("Fetched exercises:", allExercises);

        const grouped = groupByCategory(allExercises);
        // console.log("Grouped categories:", grouped);

        setCategories(grouped);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupByCategory = (exerciseList) => {
    const map = {};
    exerciseList.forEach((ex) => {
      const cat = ex.category;
      if (!cat) return;
      if (!map[cat.id]) {
        map[cat.id] = { name: cat.name, exercises: [] };
      }
      map[cat.id].exercises.push(ex);
    });
    return map;
  };
 const handleRecommend = async () => {
    setRecLoading(true);
    try {
      // 1️⃣ Obține token-ul și user-ul
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Nu sunt logat!");
      const userStr = await AsyncStorage.getItem("user");
      const user = JSON.parse(userStr);

      // 2️⃣ Sincronizează și retraining pe backend
      await axios.post(
        `${TTS_API_URL}/api/update-and-train`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3️⃣ Cerea top-10 recomandări
      const recoRes = await axios.get(
        `${TTS_API_URL}/api/recommend/${user.id}?k=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const ids = recoRes.data.exerciseIds;
      if (!ids?.length) {
        Alert.alert("Nicio recomandare", "Nu s-au găsit exerciții pentru tine.");
        return;
      }

      // 4️⃣ Alege aleator un ID și adu datele lui
      const chosenId = ids[Math.floor(Math.random() * ids.length)];
      const ex = await exerciseService.getExerciseById(chosenId);

      // 5️⃣ Deschide modalul
      setRecommendedExercise(ex);
      setModalVisible(true);

    } catch (err) {
      console.error(err);
      Alert.alert("Eroare", err.response?.data?.error || err.message);
    } finally {
      setRecLoading(false);
    }
  };
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  return (
        <View style={{ flex: 1, backgroundColor: "#16132D" }}>
    
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Exercise Categories</Text>

      {Object.keys(categories).length === 0 && (
        <Text style={styles.text}>No exercises available.</Text>
      )}

       

      <View style={styles.grid}>
  {Object.entries(categories).map(([id, cat]) => (
    <TouchableOpacity
      key={id}
      style={styles.exerciseCard}
      onPress={() =>
        navigation.navigate("ExerciseListScreen", {
          categoryId: parseInt(id),
          exercises: cat.exercises,
          categoryName: cat.name,
        })
      }
    >
      
<Ionicons
  name={iconMap[cat.name] || iconMap["Unknown"]}
  size={32}
  color="#5A4E4D"
  style={styles.cardIcon}
/>



      <Text style={styles.cardLabel}>{cat.name}</Text>
    </TouchableOpacity>
  ))}
</View>

<View style={styles.centeredContainer}>
<TouchableOpacity
  style={styles.recommendButton}
  onPress={handleRecommend}
  disabled={recLoading}
>
  {recLoading ? (
    <ActivityIndicator color="#16132D" size="large" />
  ) : (
    <>
      <Ionicons
        name="lock-open-outline"
        size={28}
        color="#5A4E4D"
        style={{ marginBottom: 8 }}
      />
      <Text style={styles.recommendText}>Need a suggestion?</Text>
    </>
  )}
</TouchableOpacity>

</View>

    </ScrollView>
    {/* Modalul cu exercițiul recomandat */}
      <ExerciseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        exercise={recommendedExercise}
        fromRecommend={true}
      />
    </View>
  );
};

export default ExercisesScreen;
