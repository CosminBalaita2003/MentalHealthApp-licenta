import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import GlobalStyles from "../styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [answers, setAnswers] = useState(Array(questions.length).fill(0));
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "User is not authenticated!");
        return;
      }

      const requestBody = {
        id: 0,
        userId: user.id,
        testDate: new Date().toISOString(),
        testType: "PSS-10",
        score: answers.reduce((sum, val) => sum + val, 0),
        interpretation: "Result Interpretation Here...",
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

      if (!response.ok) {
        throw new Error("Failed to save test result");
      }

      Alert.alert("Test Submitted!", "Your results have been saved.");
      onClose();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center", padding: 20 }}>
      <Text style={GlobalStyles.title}>Perceived Stress Scale (PSS-10)</Text>

      <View style={{ flex: 1, width: "100%" }}>
        {questions.map((question, index) => (
          <View key={index} style={GlobalStyles.questionContainer}>
            <Text style={GlobalStyles.questionText}>{question}</Text>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  GlobalStyles.optionButton,
                  answers[index] === option.value && GlobalStyles.selectedOption,
                ]}
                onPress={() => handleChange(index, option.value)}
              >
                <Text style={GlobalStyles.buttonText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <TouchableOpacity style={GlobalStyles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={GlobalStyles.buttonText}>Submit Answers</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default StressTest;
