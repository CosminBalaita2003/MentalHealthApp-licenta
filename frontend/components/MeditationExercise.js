
import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import styles from "../styles/exerciseScreenStyles";
import theme from "../styles/theme";
import { saveProgress } from "../services/progressService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { speakText, speakTextAndWait, stopTTS } from "../utils/useTTS";


const MeditationExercise = ({ exercise, onClose, onRunningChange }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [currentZone, setCurrentZone] = useState(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [preparingZoneIndex, setPreparingZoneIndex] = useState(0);


  const progressAnim = useRef(new Animated.Value(0)).current;
  const exerciseStartTime = useRef(null);

  const zones = exercise?.stepsJson ? JSON.parse(exercise.stepsJson) : [];

  const startExercise = async () => {
    if (!zones.length) return;
  
    setIsPreparing(true); // 🕒 indicăm că descrierea e în curs
    setIsRunning(true);   // 🟢 schimbăm butonul în „Stop”
    onRunningChange?.(true);
  
    await speakTextAndWait("The exercise is about to begin. Close your eyes and relax.");
    await speakTextAndWait(exercise.description);
      
    setIsPreparing(false); // ✅ descriere gata, acum putem porni exercițiul
  
    setStepIndex(0);
    setCurrentZone(zones[0]);
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
    await stopTTS(); // 🔇 oprește orice redare TTS activă
    setIsRunning(false);
    onRunningChange?.(false);
    setStepIndex(0);
    setCurrentZone(null);
    setIsPreparing(false);
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
  
      await speakTextAndWait("Great job! You’ve completed your session. Remember, even a few minutes of mindfulness can improve your day.");

      onClose(true); 
    }
  };

  useEffect(() => {
    if (!isRunning || isPreparing || stepIndex >= zones.length) return;
  
    const zone = zones[stepIndex];
    setCurrentZone(zone);
  
    speakText(`Focus on your ${zone}`);
  
    const stepTimeout = setTimeout(() => {
      const nextIndex = stepIndex + 1;
      if (nextIndex < zones.length) {
        setStepIndex(nextIndex);
      }
    }, (exercise.duration / zones.length) * 1000);
  
    return () => {clearTimeout(stepTimeout);
      // stopTTS();
  }; // curățăm timeout-ul și oprim TTS la demontare
  }, [isRunning, isPreparing, stepIndex]); // 👈 am adăugat isPreparing aici
  useEffect(() => {
    if (!isPreparing || !zones.length) return;
  
    const interval = setInterval(() => {
      setPreparingZoneIndex((prevIndex) => (prevIndex + 1) % zones.length);
    }, 500); // poți ajusta viteza aici
  
    return () => clearInterval(interval);
  }, [isPreparing, zones.length]);
  
  const renderZone = (zone) => {
    const isActive = zone === currentZone;
    return (
      <View
        key={zone}
        style={{
          width: 120,
          height: 40,
          marginVertical: 4,
          borderRadius: 20,
          backgroundColor: isActive ? theme.colors.accent : 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.text,
        }}
      >
        <Text style={{ color: theme.colors.text, textAlign: 'center', paddingTop: 10 }}>{zone}</Text>
      </View>
    );
  };

  return (
    <View style={{ marginTop: 70, alignItems: "center", justifyContent: "center" }}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
  {zones.slice().reverse().map(renderZone)}
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
        {isRunning && !isPreparing && (
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
          <Text style={[styles.cardText, { zIndex: 1 }]}> {isRunning ? "Stop" : "Start"} </Text>
        </TouchableOpacity>
      </View>
      
      {isRunning && (
        <Text style={[styles.text, { fontSize: 12, marginTop: 10, opacity: 0.7, textAlign: "center" }]}>Stopping the exercise before the timer ends will result in not saving the progress.</Text>
      )}
      
    </View>
  );
};

export default MeditationExercise;
