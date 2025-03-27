import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/exerciseScreenStyles";
import ExerciseModal from "../components/ExerciseModal";
import theme from "../styles/theme";

const ExerciseListScreen = ({ route }) => {
  const { categoryId, exercises, categoryName } = route.params;
  const [selectedExercise, setSelectedExercise] = useState(null);
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔼 Header cu săgeată + titlu */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { marginTop: 0, marginLeft: 10, flexShrink: 1 }]}>
            {categoryName}
          </Text>
        </View>

        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.card}
            onPress={() => setSelectedExercise(exercise)}
          >
            <Text style={styles.cardText}>{exercise.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedExercise && (
        <ExerciseModal
          visible={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          exercise={selectedExercise}
        />
      )}
    </View>
  );
};

export default ExerciseListScreen;
