// screens/ExerciseSummaryScreen.js
import React from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProgressSummary from "../components/ProgressSummary";
import styles from "../styles/progressStyles";

const ProgressScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Progress</Text>
      </View>
      <ProgressSummary />
    </ScrollView>
  );
};

export default ProgressScreen;
