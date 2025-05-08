import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import styles from "../styles/exerciseScreenStyles";
import theme from "../styles/theme";
import { saveProgress } from "../services/progressService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { analyzeExpressionFromBase64 } from "../utils/useExpressionAI";
import { saveDetectedEmotion } from "../services/emotionService";


const getSuggestionForEmotion = (emotion) => {
  switch (emotion) {
    case "neutral":
      return "Focus on your breath and let go of distractions.";
    case "happy":
      return "You’re doing great, keep it up!";
    case "neutral":
      return "Focus on your breath and let go of distractions.";
    case "sad":
      return "Take a deep breath and focus on the present.";
    case "angry":
      return "Try relaxing your muscles. You’ve got this.";
    case "fearful":
      return "You’re safe. Let your breath calm you.";
    case "surprised":
      return "Take it slow. Let the surprise pass.";
    case "disgusted":
      return "Release the tension. You're in control.";
    case "...analyzing":
      return "You can do it!";
    default:
      return "Keep breathing and stay present.";
  }
};

const BreathingExercise = ({ exercise, onClose, onRunningChange }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);
  const [allowCamera, setAllowCamera] = useState(null);

  const emotionCountsRef = useRef({});
  const [dominantEmotion, setDominantEmotion] = useState(null);

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

  const updateDominantEmotion = () => {
    const counts = emotionCountsRef.current;
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    setDominantEmotion(sorted[0]?.[0] ?? null);
  };

  const captureAndAnalyze = async () => {
    if (!allowCamera || isAnalyzingRef.current) return;
    isAnalyzingRef.current = true;
  
    try {
      if (cameraRef.current?.takePictureAsync) {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.2,
        });
  
        await analyzeExpressionFromBase64(photo.base64, async (data) => {
          if (data.emotion) {
            const emotionName = data.emotion.toLowerCase();
        
            // 👉 Doar dacă e o emoție nouă, o setăm
            if (emotionName !== prevEmotionRef.current) {
              prevEmotionRef.current = emotionName;
        
              const counts = emotionCountsRef.current;
              counts[emotionName] = (counts[emotionName] || 0) + 1;
              emotionCountsRef.current = { ...counts };
        
              updateDominantEmotion();
            }
          }
        });
        
      }
    } catch (err) {
      console.error("❌ Failed to capture/analyze:", err);
    } finally {
      isAnalyzingRef.current = false;
    }
  };
  
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
  
  const startExercise = () => {
    if (!steps.length) return;
    setIsRunning(true);
    onRunningChange?.(true);
    setStepIndex(0);
    setCurrentStep(steps[0]);
    progressAnim.setValue(0);
    exerciseStartTime.current = Date.now();
    emotionCountsRef.current = {};
    setDominantEmotion(null);

    const totalDuration = exercise.duration || 60;
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: totalDuration * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) stopExercise(true);
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

    // ✅ Save top 3 detected emotions
    const sorted = Object.entries(emotionCountsRef.current)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    for (const [emotionName] of sorted) {
      await saveDetectedEmotion({
        emotionName,
        sentence: null,
        source: "breathing"
      });
    }

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

  // useEffect(() => {
  //   if (!isRunning) return;
  //   const interval = setInterval(() => {
  //     captureAndAnalyze();
  //   }, 1500); // mai des
  //   return () => clearInterval(interval);
  // }, [isRunning]);

  if (allowCamera === null) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1, padding: 20 }}>
        <Text style={[styles.text, { fontSize: 18, textAlign: "center", marginBottom: 20 }]}>
          Would you like to enable the camera for facial emotion feedback during this exercise?
        </Text>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <TouchableOpacity
            onPress={() => setAllowCamera(true)}
            style={{ padding: 12, backgroundColor: theme.colors.semiaccent, borderRadius: 8 }}
          >
            <Text style={styles.cardText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setAllowCamera(false)}
            style={{ padding: 12, backgroundColor: theme.colors.text, borderRadius: 8 }}
          >
            <Text style={styles.cardText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
          {allowCamera && hasPermission && isFocused ? (
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
          ) : (
            <Animated.View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: theme.colors.text,
                opacity: 0.2,
                borderRadius: 100,
                transform: [{ scale: scaleAnim }],
              }}
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
          {allowCamera && (
            <Text style={[styles.text, { fontSize: 14, color: theme.colors.semiaccent, marginTop: 4, textAlign: "center" }]}>
              {getSuggestionForEmotion(dominantEmotion || "...analyzing")}
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
