import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import styles from "../styles/exerciseScreenStyles";
import theme from "../styles/theme";
import { saveProgress } from "../services/progressService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { speakTextAndWait, stopTTS } from "../utils/useTTS";
const PMRExercise = ({ exercise, onClose, onRunningChange }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const steps = exercise?.stepsJson ? JSON.parse(exercise.stepsJson) : [];
  const intervalRef = useRef(null);

  const startExercise = async () => {
    if (!steps.length) return;

    setIsRunning(true);
    onRunningChange?.(true);
    setStepIndex(0);
    progressAnim.setValue(0);

    await speakTextAndWait("The exercise is about to begin. Close your eyes and relax.");
    await speakTextAndWait(exercise.description);

    const durationPerStep = (exercise.duration || 60) / steps.length;

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: (exercise.duration || 60) * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    let index = 0;
    const runStep = async () => {
        if (index >= steps.length) {
          stopExercise(true);
          return;
        }
      
        setStepIndex(index);
      
        const startTime = performance.now();
        await speakTextAndWait(steps[index]);
        const elapsed = (performance.now() - startTime) / 1000;
      
        index++;
        const remainingTime = Math.max(0, durationPerStep - elapsed);
        intervalRef.current = setTimeout(runStep, remainingTime * 1000);
      };
      
    runStep();
  };

  const stopExercise = async (completed = false) => {
    clearTimeout(intervalRef.current);
    await stopTTS();
    setIsRunning(false);
    onRunningChange?.(false);
    setStepIndex(0);
    progressAnim.stopAnimation();
    progressAnim.setValue(0);

    if (completed && onClose) {
      try {
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        if (user?.id) {
          await saveProgress(exercise.id, user);
        }
      } catch (e) {
        console.error("❌ Could not save progress:", e);
      }

      await speakTextAndWait("Great job! You’ve completed your session.");
      onClose(true);
    }
  };

  return (
    <View style={{ marginTop: 70, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}>
      <View style={{ marginBottom: 20 }}>
        {steps.map((step, index) => (
          <Text
            key={index}
            style={[styles.text, {
              fontSize: 16,
              opacity: index === stepIndex ? 1 : 0.5,
              fontWeight: index === stepIndex ? "bold" : "normal"
            }]}
          >
            • {step}
          </Text>
        ))}
      </View>

      <View style={{ width: 200, height: 50, marginTop: 30 }}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: isRunning ? theme.colors.semiaccent : theme.colors.text,
          }}
        >
          {isRunning && (
            <Animated.View
              style={{
                height: "100%",
                backgroundColor: theme.colors.text,
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              }}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={isRunning ? () => stopExercise(false) : startExercise}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
          }}
        >
          <Text style={[styles.cardText, { zIndex: 1 }]}>
            {isRunning ? "Stop" : "Start"}
          </Text>
        </TouchableOpacity>
      </View>

      {isRunning && (
        <Text style={[styles.text, { fontSize: 12, marginTop: 10, opacity: 0.7, textAlign: "center" }]}>
          Stopping the exercise before the timer ends will result in not saving the progress.
        </Text>
      )}
    </View>
  );
};

export default PMRExercise;
