import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Modal, Pressable, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUserProgress } from "../services/progressService";
import { fetchUserEntries } from "../services/journalService";
import testService from "../services/testService";
import exerciseService from "../services/exerciseService";
import styles from "../styles/progressStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import benefits from "../data/exercise_benefits.json";

import { useNavigation } from "@react-navigation/native";
const iconMap = {
  "Breathing": "leaf-outline",
  "Meditation & Mindfulness": "flower-outline",
  "Progressive Muscle Relaxation": "body-outline",
  "Emotional Regulation Exercises": "happy-outline",
  "Visualization Techniques": "eye-outline",
  "Stress Management Techniques": "pulse-outline",
  "Unknown": "help-circle-outline"
};

const ProgressSummary = () => {
  const [summaryData, setSummaryData] = useState({});
  const [loading, setLoading] = useState(true);
  const [journalCount, setJournalCount] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [activeModalCategory, setActiveModalCategory] = useState(null);
  const navigation = useNavigation();


  useEffect(() => {
    const loadData = async () => {
      try {
        const [progressList, exercises] = await Promise.all([
          getUserProgress(),
          exerciseService.getAllExercises(),
        ]);

        const grouped = {};
        let totalExercises = 0;

        exercises.forEach((ex) => {
          const catName = ex.category?.name || "Unknown";
          if (!grouped[catName]) {
            grouped[catName] = { count: 0 };
          }
        });

        progressList.forEach((p) => {
          const catName = p.exercise?.category?.name || "Unknown";
          if (!grouped[catName]) {
            grouped[catName] = { count: 0 };
          }
          grouped[catName].count++;
          totalExercises++;
        });

        setSummaryData(grouped);
        setExerciseCount(totalExercises);

        const journalRes = await fetchUserEntries();
        if (journalRes.success) setJournalCount(journalRes.entries.length);

        const userId = await AsyncStorage.getItem("userId");
        const testRes = await testService.getUserTests(userId);
        if (testRes.success) setTestCount(testRes.tests.length);
      } catch (err) {
        console.error("❌ Error loading progress summary:", err);
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
      <Text style={styles.title}>Your Activity Summary:</Text>

      <View style={styles.sectionContainer}>
  <Pressable onPress={() => navigation.replace("Main", { screen: "Journal" })} style={styles.categoryCard}>
    <View style={styles.categoryLeft}>
      <Ionicons name="book-outline" size={24} color="#E8BCB9" />
      <Text style={styles.categoryTitle}>Journals written</Text>
    </View>
    <Text style={styles.categoryCount}>{journalCount}</Text>
  </Pressable>

  <Pressable onPress={() => navigation.replace("Main", { screen: "Test" })} style={styles.categoryCard}>
    <View style={styles.categoryLeft}>
      <Ionicons name="medkit-outline" size={24} color="#E8BCB9" />
      <Text style={styles.categoryTitle}>Tests completed</Text>
    </View>
    <Text style={styles.categoryCount}>{testCount}</Text>
  </Pressable>

  <Pressable onPress={() => navigation.replace("Main", { screen: "Exercises" })} style={styles.categoryCard}>
    <View style={styles.categoryLeft}>
      <Ionicons name="barbell-outline" size={24} color="#E8BCB9" />
      <Text style={styles.categoryTitle}>Exercises completed</Text>
    </View>
    <Text style={styles.categoryCount}>{exerciseCount}</Text>
  </Pressable>
</View>

      <View style={{ height: 1, backgroundColor: "#fff", marginVertical: 10 }} />

      <Text style={styles.titleSection}>Your Exercises:</Text>

      {Object.entries(summaryData).map(([category, data]) => (
  <View key={category}>
    <Pressable onPress={() => setActiveModalCategory(category)} style={styles.categoryCard}>
      <View style={styles.categoryLeft}>
        <Ionicons name={iconMap[category] || "help-circle-outline"} size={24} color="#E8BCB9" />
        <Text style={styles.categoryTitle}>{category}</Text>
      </View>
      <Text style={styles.categoryCount}>{data.count}</Text>
    </Pressable>
  </View>
))}


      <Modal
  visible={!!activeModalCategory}
  animationType="fade"
  transparent={true}
  onRequestClose={() => setActiveModalCategory(null)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.cardTitle}>{activeModalCategory}</Text>
      <Text style={styles.cardDescription}>
        {benefits[activeModalCategory] || "No benefit description available."}
      </Text>
      <TouchableOpacity
        onPress={() => setActiveModalCategory(null)}
        style={styles.modalCloseButton}
      >
        <Text style={styles.modalCloseText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
}
   

export default ProgressSummary;
