import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/testStyles";


const questions = [
  "In the last month, how often have you been upset because something that happened unexpectedly?",
  "In the last month, how often have you felt that you were unable to control important things in your life?",
  "In the last month, how often have you felt nervous and stressed?",
  "In the last month, how often have you felt confident about your ability to handle personal problems?",
  "In the last month, how often have you felt that things were going your way?",
  "In the last month, how often have you found that you could not cope with all the things you had to do?",
  "In the last month, how often have you been able to control irritations in your life?",
  "In the last month, how often have you felt that you were on top of things?",
  "In the last month, how often have you been angered because of things that were outside of your control?",
  "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
];

const options = [
  { label: "Never", value: 0 },
  { label: "Almost never", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Fairly often", value: 3 },
  { label: "Very often", value: 4 },
];

const StressTest = ({ user, onClose }) => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleSelect = (value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User is not authenticated!");
        return;
      }

      const reverseScored = [3, 4, 6, 7];
      const finalScore = answers.reduce((sum, val, i) =>
        sum + (reverseScored.includes(i) ? 4 - val : val), 0);

      const interpretation =
        finalScore <= 13 ? "Low Stress" :
        finalScore <= 26 ? "Moderate Stress" : "High Stress";

      const requestBody = {
        id: 0,
        userId: user.id,
        testDate: new Date().toISOString(),
        testType: "PSS-10",
        score: finalScore,
        interpretation,
        recommendations: "Try relaxation techniques, mindfulness, and managing your daily workload.",
      };

      const response = await fetch(`${process.env.API_URL}/api/tests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to save test result");
      Alert.alert("Test Submitted!", "Your results have been saved.");
      onClose();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

   return (
      <View style={{ flex: 1, backgroundColor: "#16132D", padding: 20 }}>
        <StatusBar barStyle="light-content" backgroundColor="#16132D" />
  
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>PSS-10 Stress Test</Text>
        </View>
  
        {/* Progress Indicator */}
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              },
            ]}
          />
        </View>
  
        {/* Question Area */}
        <View style={styles.questionWrapper}>
          <Text style={styles.questionText}>{questions[currentQuestion]}</Text>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                answers[currentQuestion] === option.value && styles.selectedOption,
              ]}
              onPress={() => handleSelect(option.value)}
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
  
        {/* Navigation buttons */}
        <View style={styles.navButtons}>
          {currentQuestion > 0 && (
            <TouchableOpacity
              style={[styles.navButton, { marginRight: 8 }]}
              onPress={() => setCurrentQuestion(currentQuestion - 1)}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}
          {currentQuestion < questions.length - 1 ? (
            <TouchableOpacity
              style={[
                styles.navButton,
                answers[currentQuestion] === null && styles.disabledButton,
              ]}
              onPress={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={answers[currentQuestion] === null}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.navButton,
                answers[currentQuestion] === null && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={loading || answers[currentQuestion] === null}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
};

export default StressTest;
