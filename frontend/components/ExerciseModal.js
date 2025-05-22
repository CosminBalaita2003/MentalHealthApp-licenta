import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, Alert } from "react-native";
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
   if (!visible || !exercise) {
    return null;
  }
  const isBreathing = exercise?.category?.name === "Breathing";
const isMeditation = exercise?.category?.name === "Meditation & Mindfulness";
const isPMR = exercise?.category?.name === "Progressive Muscle Relaxation";
const isVisualization = exercise?.category?.name === "Visualization Techniques";
const isEmotionalRegulation = exercise?.category?.name === "Emotional Regulation Exercises";
const isStressManagement = exercise?.category?.name === "Stress Management Techniques";

  const steps = isBreathing && exercise.stepsJson ? JSON.parse(exercise.stepsJson) : [];
  const navigation = useNavigation();
  const [isRunning, setIsRunning] = useState(false);
  const [user, setUser] = useState(null); // 👈 salvăm user local

  useEffect(() => {
    const loadUserAndLogInfo = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      const userString = await AsyncStorage.getItem("user");

      console.log("🔐 Token:", token);
      console.log("👤 User ID:", userId);
      console.log("👤 User String:", userString);

      if (userString) {
        const parsedUser = JSON.parse(userString);
        setUser(parsedUser);
      }
    };

    if (visible) loadUserAndLogInfo();
  }, [visible]);

  const handleClose = (completed = false) => {
    stopTTS();
    if (completed) {
      Alert.alert(
        "Great job!",
        "You have completed the exercise.",
        [{ text: "OK", onPress: () => 
          //navigation.pop(2)
           fromRecommend ? onClose() : navigation.pop(2)}],
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
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleClose(false)}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { marginTop: 0, marginLeft: 10, flexShrink: 1 }]}>
            {exercise.name}
          </Text>
        </View>

        <Text style={styles.text}>{exercise.description}</Text>

        {steps.length > 0 && (
          <View style={{ marginTop: 20 }}>
            {steps.map((step, index) => (
              <Text key={index} style={styles.text}>• {step}</Text>
            ))}
          </View>
        )}

        {isBreathing && user && (
          <BreathingExercise
            exercise={exercise}
            onClose={handleClose}
            onRunningChange={setIsRunning}
            user={user} // ✅ trimitem user din AsyncStorage
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
            user={user} // ✅ trimitem user din AsyncStorage
          />
        )}
        {isVisualization && user && (
          <VisualizationExercise
            exercise={exercise}
            onClose={handleClose}
            onRunningChange={setIsRunning}
            user={user} // ✅ trimitem user din AsyncStorage
          />
        )}

        {isEmotionalRegulation && user && (
          <EmotionalRegulationExercise
            exercise={exercise}
            onClose={handleClose}
            onRunningChange={setIsRunning}
            user={user} // ✅ trimitem user din AsyncStorage
          />
        )}
        {isStressManagement && user && (
          <StressManagementExercise
            exercise={exercise}
            onClose={handleClose}
            onRunningChange={setIsRunning}
            user={user} // ✅ trimitem user din AsyncStorage
          />
        )}


      </View>
    </Modal>
  );
};

export default ExerciseModal;
