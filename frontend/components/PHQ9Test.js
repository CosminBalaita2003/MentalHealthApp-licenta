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
  "Little interest or pleasure in doing things",
  "Feeling down, depressed or hopeless",
  "Trouble falling asleep, staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself – or that you’re a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite – being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way",
];

const options = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const PHQ9Test = ({ user, onClose }) => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSelect = (value) => {
    const updated = [...answers];
    updated[currentQuestion] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const score = answers.reduce((sum, val) => sum + val, 0);

      let interpretation = "Unknown";
      if (score <= 4) interpretation = "None-minimal";
      else if (score <= 9) interpretation = "Mild";
      else if (score <= 14) interpretation = "Moderate";
      else if (score <= 19) interpretation = "Moderately Severe";
      else interpretation = "Severe";

      const requestBody = {
        id: 0,
        userId: user.id,
        testDate: new Date().toISOString(),
        testType: "PHQ-9",
        score,
        interpretation,
        recommendations:
          "Based on score: consider treatment plan with counseling, pharmacotherapy or referral if needed.",
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
        <Text style={styles.title}>PHQ-9 Depression Test</Text>
      </View>

      {/* Progress */}
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

      {/* Question */}
      <View style={styles.questionWrapper}>
        <Text style={styles.questionText}>{questions[currentQuestion]}</Text>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              answers[currentQuestion] === option.value &&
                styles.selectedOption,
            ]}
            onPress={() => handleSelect(option.value)}
          >
            <Text style={styles.buttonText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Navigation */}
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

export default PHQ9Test;
