import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, Alert, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/exerciseScreenStyles";
import theme from "../styles/theme";

import BreathingExercise from "./BreathingExercise";
import MeditationExercise from "./MeditationExercise";
import PMRExercise from "./PMRExercise";
import VisualizationExercise from "./VisualizationExercise";
import EmotionalRegulationExercise from "./EmotionalRegulationExercise";
import StressManagementExercise from "./StressManagementExercise";

import { stopTTS } from "../utils/useTTS";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ExerciseModal = ({ visible, onClose, exercise, fromRecommend = false }) => {
  if (!visible || !exercise) return null;

  // flag pentru secundar modal
  const [infoVisible, setInfoVisible] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  // parsează pașii din JSON
  const steps = exercise.stepsJson ? JSON.parse(exercise.stepsJson) : [];

  // categorii
  const isBreathing = exercise.category.name === "Breathing";
  const isMeditation = exercise.category.name === "Meditation & Mindfulness";
  const isPMR = exercise.category.name === "Progressive Muscle Relaxation";
  const isVisualization = exercise.category.name === "Visualization Techniques";
  const isEmotionalRegulation = exercise.category.name === "Emotional Regulation Exercises";
  const isStressManagement = exercise.category.name === "Stress Management Techniques";

  useEffect(() => {
    if (!visible) return;
    (async () => {
      const userString = await AsyncStorage.getItem("user");
      if (userString) setUser(JSON.parse(userString));
    })();
  }, [visible]);

  const handleClose = (completed = false) => {
    stopTTS();
    if (completed) {
      Alert.alert(
        "Great job!",
        "You have completed the exercise.",
        [{ text: "OK", onPress: () => fromRecommend ? onClose() : navigation.pop(2) }],
        { cancelable: false }
      );
    } else if (isRunning) {
      Alert.alert(
        "Exit exercise?",
        "If you go back now, your progress will not be saved.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", style: "destructive", onPress: onClose }
        ]
      );
    } else {
      onClose();
    }
  };

  return (
   <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleClose(false)} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { marginTop: 0, marginLeft: 10, flexShrink: 1 }]}>
            {exercise.name}
          </Text>
        </View>

        {/* BUTONUL DE INFO */}
        {steps.length > 0 && !infoVisible && (
          <View style={{ marginTop: 0 }}>
            <TouchableOpacity
              style={[styles.button, { height: 50, justifyContent: "center", alignItems: "center", width: "100%" }]}
               onPress={() => {
        Keyboard.dismiss();
        setInfoVisible(true);
      }}
            >
              <Text style={styles.buttonText}>Do you want to know what you have to do?</Text>
            </TouchableOpacity>
          </View>
        )}

          {/* Componentele exercițiului */}
          {isBreathing && user && (
            <BreathingExercise
              exercise={exercise}
              onClose={handleClose}
              onRunningChange={setIsRunning}
              user={user}
            />
          )}
          {isMeditation && user && (
            <MeditationExercise
              exercise={exercise}
              onClose={handleClose}
              onRunningChange={setIsRunning}
            />
          )}
          {isPMR && user && (
            <PMRExercise
              exercise={exercise}
              onClose={handleClose}
              onRunningChange={setIsRunning}
              user={user}
            />
          )}
          {isVisualization && user && (
            <VisualizationExercise
              exercise={exercise}
              onClose={handleClose}
              onRunningChange={setIsRunning}
              user={user}
            />
          )}
          {isEmotionalRegulation && user && (
            <EmotionalRegulationExercise
              exercise={exercise}
              onClose={handleClose}
              onRunningChange={setIsRunning}
              user={user}
            />
          )}
          {isStressManagement && user && (
            <StressManagementExercise
              exercise={exercise}
              onClose={handleClose}
              onRunningChange={setIsRunning}
              user={user}
            />
          )}
     

        {/* OVERLAY CU PAȘII */}
        {infoVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.cardTitle}>What You Have To Do</Text>
              <Text style={styles.cardDescription}>{exercise.description}</Text>
              {steps.map((s, i) => (
                <Text key={i} style={styles.cardDescription}>• {s}</Text>
              ))}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setInfoVisible(false)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </View>
    </Modal>
  );
};

export default ExerciseModal;