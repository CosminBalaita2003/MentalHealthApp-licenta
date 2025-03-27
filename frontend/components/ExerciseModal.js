import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/exerciseScreenStyles";
import theme from "../styles/theme";

const ExerciseModal = ({ visible, onClose, exercise }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20 }}>
        
        {/* 🔼 Headerul custom */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { marginTop: 0, marginLeft: 10, flexShrink: 1 }]}>
            {exercise.name}
          </Text>
        </View>

        <Text style={styles.text}>{exercise.description}</Text>

        {exercise.stepsJson && (
          <View style={{ marginTop: 20 }}>
            {JSON.parse(exercise.stepsJson).map((step, index) => (
              <Text key={index} style={styles.text}>• {step}</Text>
            ))}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default ExerciseModal;
