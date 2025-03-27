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
import styles from "../styles/exerciseScreenStyles";

const ExercisesScreen = () => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allExercises = await exerciseService.getAllExercises();
        console.log("Fetched exercises:", allExercises);

        const grouped = groupByCategory(allExercises);
        console.log("Grouped categories:", grouped);

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

      {Object.entries(categories).map(([id, cat]) => (
        <TouchableOpacity
          key={id}
          style={styles.card}
          onPress={() =>
            navigation.navigate("ExerciseListScreen", {
              categoryId: parseInt(id),
              exercises: cat.exercises,
              categoryName: cat.name,
            })
          }
        >
          <Text style={styles.cardText}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </View>
  );
};

export default ExercisesScreen;
