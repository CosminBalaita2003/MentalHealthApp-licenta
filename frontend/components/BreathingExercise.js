import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import styles from "../styles/exerciseScreenStyles";
import theme from "../styles/theme";
import { saveProgress } from "../services/progressService";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅

const BreathingExercise = ({ exercise, onClose, onRunningChange }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const lastScale = useRef(1);
  const exerciseStartTime = useRef(null);

  const steps = exercise?.stepsJson ? JSON.parse(exercise.stepsJson) : [];

  const animateScale = (step) => {
    let toValue = 1;
    const stepLower = step.toLowerCase();

    if (stepLower.startsWith("inhale")) toValue = 1.5;
    else if (stepLower.startsWith("exhale")) toValue = 0.7;
    else if (stepLower.startsWith("hold")) toValue = lastScale.current;

    const durationMatch = step.match(/(\d+)/);
    const duration = durationMatch ? parseInt(durationMatch[1]) * 1000 : 4000;

    if (!stepLower.startsWith("hold")) {
      lastScale.current = toValue;
      Animated.timing(scaleAnim, {
        toValue,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  // const startExercise = () => {
  //   if (!steps.length) return;
  //   setIsRunning(true);
  //   onRunningChange?.(true);
  //   setStepIndex(0);
  //   setCurrentStep(steps[0]);
  //   progressAnim.setValue(0);
  //   exerciseStartTime.current = Date.now();
  // };
  const startExercise = () => {
    if (!steps.length) return;
    setIsRunning(true);
    onRunningChange?.(true);
    setStepIndex(0);
    setCurrentStep(steps[0]);
    progressAnim.setValue(0);
    exerciseStartTime.current = Date.now();
  
    const totalDuration = exercise.duration || 60;
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: totalDuration * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        stopExercise(true);
      }
    });
  };
  
  const stopExercise = async (completed = false) => {
    setIsRunning(false);
    onRunningChange?.(false);
    setStepIndex(0);
    setCurrentStep(null);
    setRemainingTime(0);
    scaleAnim.setValue(1);
    progressAnim.stopAnimation();
progressAnim.setValue(0);


    if (completed && onClose) {
      try {
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        console.log("📤 Saving progress for user:", user?.id);

        if (user?.id) {
          await saveProgress(exercise.id, user);
        } else {
          console.warn("⚠️ User data not found in AsyncStorage.");
        }
      } catch (e) {
        console.error("❌ Could not save progress:", e);
      }

      onClose(true);
    }
  };

  useEffect(() => {
    if (!isRunning || stepIndex >= steps.length) return;

    const step = steps[stepIndex];
    setCurrentStep(step);
    animateScale(step);

    const durationMatch = step.match(/(\d+)/);
    const duration = durationMatch ? parseInt(durationMatch[1]) : 4;
    setRemainingTime(duration);

    const countdownInterval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const stepTimeout = setTimeout(() => {
      const nextIndex = (stepIndex + 1) % steps.length;
      setStepIndex(nextIndex);
    }, duration * 1000);


    return () => {
      clearTimeout(stepTimeout);
      clearInterval(countdownInterval);
    };
  }, [isRunning, stepIndex]);

  return (
    <View style={{ marginTop: 70, alignItems: "center", justifyContent: "center" }}>
      {/* Animated circle */}
      <View style={{ position: "relative", width: 120, height: 120, marginBottom: 20 }}>
        <Animated.View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: theme.colors.text,
            transform: [{ scale: scaleAnim }],
          }}
        />
        {isRunning && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 120,
              height: 120,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={[styles.text, { fontSize: 16, color: theme.colors.background, marginBottom: 4 }]}>
              {currentStep?.split(" ")[0]}
            </Text>
            <Text style={[styles.text, { fontSize: 22, color: theme.colors.background, fontWeight: "bold" }]}>
              {remainingTime}s
            </Text>
          </View>
        )}
      </View>

      {/* Progress button */}
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

export default BreathingExercise;
