import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import styles from "../styles/exerciseScreenStyles";
import theme from "../styles/theme";
import { saveProgress } from "../services/progressService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { analyzeExpressionFromBase64 } from "../utils/useExpressionAI";

// ... restul importurilor
const getSuggestionForEmotion = (emotion) => {
  switch (emotion) {
    case "happy":
    case "neutral":
      return "You’re doing great, keep it up! (happy)";
    case "sad":
      return "Take a deep breath and focus on the present. (sad)";
    case "angry":
      return "Try relaxing your muscles. You’ve got this. (angry)";
    case "fear":
      return "You’re safe. Let your breath calm you. (fear)";
    case "surprise":
      return "Take it slow. Let the surprise pass. (surprise)";
    case "disgust":
      return "Release the tension. You're in control. (disgust)";
    case "...analyzing":
      return "You can do it! (analyzing)";
    default:
      return "Keep breathing and stay present. (unknown)";
  }
};

const BreathingExercise = ({ exercise, onClose, onRunningChange }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);
  const [emotion, setEmotion] = useState(null);

  const cameraRef = useRef(null);
  const isFocused = useIsFocused();
  const isAnalyzingRef = useRef(false);
  const prevEmotionRef = useRef(null);
  const lastEmotionUpdateRef = useRef(Date.now());

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const lastScale = useRef(1);
  const exerciseStartTime = useRef(null);

  const steps = exercise?.stepsJson ? JSON.parse(exercise.stepsJson) : [];

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const animateScale = (step) => {
    let toValue = 1;
    const stepLower = step.toLowerCase();

    if (stepLower.startsWith("inhale")) toValue = 1.5;
    else if (stepLower.startsWith("exhale")) toValue = 0.7;
    else if (stepLower.startsWith("hold")) toValue = lastScale.current;

    const durationMatch = step.match(/(\d+)/);
    const duration = durationMatch ? parseInt(durationMatch[1]) * 1000 : 4000;

    lastScale.current = toValue;

    Animated.timing(scaleAnim, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const captureAndAnalyze = async () => {
    if (isAnalyzingRef.current) return;
    isAnalyzingRef.current = true;

    try {
      if (cameraRef.current?.takePictureAsync) {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.2,
        });

        const now = Date.now();
        const shouldUpdate = now - lastEmotionUpdateRef.current >= 5000;

        if (!emotion) setEmotion("...analyzing");

        await analyzeExpressionFromBase64(photo.base64, (data) => {
          if (shouldUpdate && data.emotion && data.emotion !== prevEmotionRef.current) {
            setEmotion(data.emotion);
            prevEmotionRef.current = data.emotion;
            lastEmotionUpdateRef.current = now;
            console.log("✅ Emotion updated:", data.emotion);
          } else {
            console.log("ℹ️ Emotion skipped or unchanged");
          }
        });
      } else {
        console.log("❌ cameraRef.current.takePictureAsync is undefined");
      }
    } catch (err) {
      console.error("❌ Failed to capture/analyze:", err);
    } finally {
      isAnalyzingRef.current = false;
    }
  };

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
        if (user?.id) {
          await saveProgress(exercise.id, user);
        }
      } catch (e) {
        console.error("Could not save progress:", e);
      }

      onClose(true);
    }
  };

  useEffect(() => {
    if (!isRunning || stepIndex >= steps.length) return;

    const step = steps[stepIndex];
    setCurrentStep(step);
    animateScale(step);

    captureAndAnalyze();

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
      clearInterval(countdownInterval);
      clearTimeout(stepTimeout);
    };
  }, [isRunning, stepIndex]);

  return (
    <View style={{ marginTop: 70, alignItems: "center", justifyContent: "center" }}>
      <View style={{ position: "relative", width: 160, height: 200, marginBottom: 20 }}>
        <Animated.View
          style={{
            position: "absolute",
            width: 170,
            height: 210,
            borderRadius: 105,
            backgroundColor: theme.colors.text,
            opacity: 0.2,
            transform: [{ scale: scaleAnim }],
            top: -5,
            left: -5,
          }}
        />
        <View
          style={{
            width: 160,
            height: 200,
            borderRadius: 100,
            overflow: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {hasPermission && isFocused && (
            <CameraView
              ref={cameraRef}
              style={{
                width: "120%",
                height: "120%",
                position: "absolute",
                top: "-10%",
                left: "-10%",
              }}
              facing="front"
            />
          )}
        </View>
      </View>

      {isRunning && (
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text style={[styles.text, { fontSize: 16, color: theme.colors.text }]}>
            {currentStep?.split(" ")[0]}
          </Text>
          <Text style={[styles.text, { fontSize: 22, fontWeight: "bold", color: theme.colors.text }]}>
            {remainingTime}s
          </Text>
          {emotion && (
            <Text style={[styles.text, { fontSize: 14, color: theme.colors.semiaccent, marginTop: 4, textAlign: "center" }]}>
              {getSuggestionForEmotion(emotion)}
            </Text>
          )}
        </View>
      )}

      <View style={{ width: 200, height: 50, marginTop: 10 }}>
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
