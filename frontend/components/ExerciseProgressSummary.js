import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { getAllProgress } from "../services/progressService";
import exerciseService from "../services/exerciseService";

const ExerciseProgressSummary = () => {
  const [categoryStats, setCategoryStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [progressList, exercises] = await Promise.all([
          getAllProgress(),
          exerciseService.getAllExercises(),
        ]);

        const categoryCounts = {};

        exercises.forEach((exercise) => {
          const category = exercise.category?.name || "Unknown";
          categoryCounts[category] = 0;
        });

        progressList.forEach((entry) => {
          const category = entry.exercise?.category?.name || "Unknown";
          if (category in categoryCounts) {
            categoryCounts[category]++;
          } else {
            categoryCounts[category] = 1;
          }
        });

        setCategoryStats(categoryCounts);
      } catch (err) {
        console.error("❌ Error loading exercise summary:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#E8BCB9" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Exercise Summary:</Text>
      {Object.entries(categoryStats).map(([category, count]) => (
        <Text key={category} style={styles.item}>
          {category}: {count}
        </Text>
      ))}
    </View>
  );
};

export default ExerciseProgressSummary;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: "#272240",
    padding: 16,
    borderRadius: 12,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    color: "#ccc",
    fontSize: 16,
    marginVertical: 4,
  },
});
