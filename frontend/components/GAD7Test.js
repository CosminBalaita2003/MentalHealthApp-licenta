import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
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

const recommendations = {
  "Minimal Anxiety": `
You’re experiencing very few symptoms of anxiety. Your overall day-to-day life is unlikely to be significantly impacted.
  
Recommendations:
- Maintain regular physical activity.
- Practice brief breathing exercises when you notice tension.
- Keep monitoring your feelings - early detection helps keep anxiety minimal.
    `,
    "Mild Anxiety": `
You're noticing occasional anxiety symptoms - like feeling nervous or having trouble relaxing - several days a week.

Recommendations:
- Introduce a short mindfulness or meditation practice (5-10 minutes daily).
- Limit caffeine and screen-time before bed.
- Talk about your worries with someone you trust.
    `,
    "Moderate Anxiety": `
Your anxiety symptoms are more frequent/intense and may interfere with work or social activities.

Recommendations:
- Consider weekly relaxation techniques (e.g., guided imagery, progressive muscle relaxation).
- Set aside “worry time” - 15 minutes per day to process anxious thoughts.
- If symptoms persist, consult a mental health professional.
    `,
    "Severe Anxiety": `
You're experiencing daily, intense anxiety that likely disrupts your ability to focus or sleep.

Recommendations:
- Seek professional support (therapist, counselor) as soon as possible.
- Explore structured therapies: CBT (Cognitive Behavioral Therapy) or mindfulness-based stress reduction.
- Reach out to your support network; don't face severe anxiety alone.
    `,
  }


const GAD7Test = ({ user, onClose }) => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [result, setResult] = useState({ score: 0, interpretation: "" });

  const handleSelect = (value) => {
    const updated = [...answers];
    updated[currentQuestion] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("User is not authenticated!");
      
      // Calculează scorul și interpretarea
      const score = answers.reduce((sum, v) => sum + v, 0);
      const interpretation =
        score <= 4
          ? "Minimal Anxiety"
          : score <= 9
          ? "Mild Anxiety"
          : score <= 14
          ? "Moderate Anxiety"
          : "Severe Anxiety";

      // Salvează în backend
      const body = {
        id: 0,
        userId: user.id,
        testDate: new Date().toISOString(),
        testType: "GAD-7",
        score,
        interpretation,
        recommendations: recommendations[interpretation],
      };
      const res = await fetch(`${process.env.API_URL}/api/tests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save test result");

      // Deschide modalul cu rezultat
      setResult({ score, interpretation });
      setModalVisible(true);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    onClose();
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
        <Text style={styles.questionText}>
          {questions[currentQuestion]}
        </Text>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.optionButton,
              answers[currentQuestion] === opt.value && styles.selectedOption,
            ]}
            onPress={() => handleSelect(opt.value)}
          >
            <Text style={styles.buttonText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.navButtons}>
        {currentQuestion > 0 && (
          <TouchableOpacity
            style={[styles.navButton, { marginRight: 8 }]}
            onPress={() => setCurrentQuestion((q) => q - 1)}
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
            disabled={answers[currentQuestion] === null}
            onPress={() =>
              setCurrentQuestion((q) => q + 1)
            }
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.navButton,
              (answers[currentQuestion] === null || loading) &&
                styles.disabledButton,
            ]}
            disabled={answers[currentQuestion] === null || loading}
            onPress={handleSubmit}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Modal rezultat */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Test Result</Text>
            <Text style={styles.modalText}>
              Score: {result.score}
            </Text>
            <Text style={styles.modalText}>
              Interpretation: {result.interpretation}
            </Text>

            <Text style={styles.modalDescription}>
              {recommendations[result.interpretation]}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={closeModal}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GAD7Test;