import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import GlobalStyles from "../styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        testType: "GAD-7",
        score: answers.reduce((sum, val) => sum + val, 0),
        interpretation: "Result Interpretation Here...",
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
    <View style={GlobalStyles.testCard}>
      <Text style={GlobalStyles.title}>GAD-7 Anxiety Test</Text>

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

      <TouchableOpacity style={GlobalStyles.submitButton} onPress={handleSubmit}>
        <Text style={GlobalStyles.buttonText}>Submit Answers</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GAD7Test;
