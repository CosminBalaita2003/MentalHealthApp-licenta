import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import styles from "../styles/exerciseScreenStyles";
import theme from "../styles/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveProgress } from "../services/progressService";

const StressManagementExercise = ({ exercise, onClose, onRunningChange }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);

  const steps = exercise?.stepsJson ? JSON.parse(exercise.stepsJson) : [];

  const startExercise = () => {
    setIsRunning(true);
    onRunningChange?.(true);
    setStepIndex(0);
    setResponses({});
    setInputValue("");
    setIsReviewing(false);
  };

  const handleNext = () => {
    const updated = { ...responses, [stepIndex]: inputValue };
    setResponses(updated);
    setInputValue("");

    if (stepIndex + 1 < steps.length) {
      setStepIndex(stepIndex + 1);
    } else {
      setIsReviewing(true);
    }
  };

  const handleEdit = (index) => {
    setStepIndex(index);
    setInputValue(responses[index] || "");
    setIsReviewing(false);
  };

  const handleSubmit = async () => {
    setIsRunning(false);
    onRunningChange?.(false);
    setStepIndex(0);
    setInputValue("");

    try {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      if (user?.id) {
        await saveProgress(exercise.id, user);
        console.log("📋 Responses:", responses);
      }
    } catch (e) {
      console.error("❌ Could not save progress:", e);
    }

    onClose(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}
    >
      {!isRunning ? (
        <TouchableOpacity
          onPress={startExercise}
          style={{
            backgroundColor: theme.colors.semiaccent,
            paddingVertical: 15,
            paddingHorizontal: 30,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: theme.colors.background, fontWeight: "bold", fontSize: 16 }}>
            Start Exercise
          </Text>
        </TouchableOpacity>
      ) : isReviewing ? (
        <ScrollView style={{ width: "100%" }}>
          <Text style={[styles.title, { marginBottom: 10 }]}>Review Your Answers</Text>
          {steps.map((step, index) => (
  <View key={index} style={{ marginBottom: 20 }}>
    <Text style={[styles.text, { fontWeight: "bold", marginBottom: 6 }]}>• {step}</Text>
    <TextInput
      style={{
        borderWidth: 1,
        borderColor: theme.colors.text,
        borderRadius: 8,
        padding: 10,
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        minHeight: 80,
        textAlignVertical: "top",
      }}
      multiline
      value={responses[index] || ""}
      onChangeText={(text) =>
        setResponses((prev) => ({
          ...prev,
          [index]: text,
        }))
      }
      placeholder="(no response)"
      placeholderTextColor={theme.colors.text + "80"}
    />
  </View>
))}

          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: theme.colors.semiaccent,
              paddingVertical: 12,
              paddingHorizontal: 25,
              borderRadius: 8,
              alignSelf: "center",
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: theme.colors.background, fontWeight: "bold" }}>Finish</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <>
          <Text style={[styles.title, { marginBottom: 20 }]}>Step {stepIndex + 1} of {steps.length}</Text>

          <Text style={[styles.text, { fontSize: 18, marginBottom: 10 }]}>
            {steps[stepIndex]}
          </Text>

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: theme.colors.text,
              borderRadius: 10,
              padding: 12,
              width: "100%",
              minHeight: 100,
              color: theme.colors.text,
              backgroundColor: theme.colors.background,
              textAlignVertical: "top",
              marginBottom: 20
            }}
            placeholder="Write your answer here..."
            placeholderTextColor={theme.colors.text + "80"}
            multiline
            value={inputValue}
            onChangeText={setInputValue}
          />

          <TouchableOpacity
            onPress={handleNext}
            style={{
              backgroundColor: theme.colors.semiaccent,
              paddingVertical: 12,
              paddingHorizontal: 25,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: theme.colors.background, fontWeight: "bold" }}>
              {stepIndex + 1 === steps.length ? "Review" : "Next"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default StressManagementExercise;
