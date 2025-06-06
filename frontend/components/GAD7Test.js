import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/testStyles";

const questions = [
  "How often have you felt nervous, anxious, or on edge?",
  "How often have you had trouble controlling your worries?",
  "How often have you had difficulty relaxing?",
  "How often have you felt restless?",
  "How often have you been easily annoyed or irritable?",
  "How often have you felt afraid that something terrible might happen?",
  "How often have you felt like you're losing control?",
];

const options = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const GAD7Test = ({ user, onClose }) => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);

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

      const score = answers.reduce((sum, val) => sum + val, 0);
      const interpretation =
        score <= 4
          ? "Minimal Anxiety"
          : score <= 9
          ? "Mild Anxiety"
          : score <= 14
          ? "Moderate Anxiety"
          : "Severe Anxiety";

      const requestBody = {
        id: 0,
        userId: user.id,
        testDate: new Date().toISOString(),
        testType: "GAD-7",
        score,
        interpretation,
        recommendations: "Try breathing exercises and relaxation techniques.",
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
        <Text style={styles.title}>GAD-7 Anxiety Test</Text>
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

export default GAD7Test;
