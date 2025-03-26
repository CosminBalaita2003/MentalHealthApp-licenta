import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import testService from "../services/testService";
import styles from "../styles/statisticsStyles";
import theme from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";
const screenWidth = Dimensions.get("window").width;

const testDescriptions = {
  "GAD-7": "The GAD-7 test measures how often you've been bothered by anxiety symptoms.",
  "PSS-10": "The PSS-10 evaluates your perceived stress levels in the last month.",
  "PHQ-9": "The PHQ-9 helps identify and measure the severity of depression symptoms.",
};


const interpretResults = (testType, score) => {
  if (testType === "GAD-7") {
    if (score <= 4) return "Minimal Anxiety";
    if (score <= 9) return "Mild Anxiety";
    if (score <= 14) return "Moderate Anxiety";
    return "Severe Anxiety";
  } else if (testType === "PSS-10") {
    if (score <= 13) return "Low Stress";
    if (score <= 26) return "Moderate Stress";
    return "High Stress";
  }
  else if (testType === "PHQ-9") {
    if (score <= 4) return "Minimal Depression";
    if (score <= 9) return "Mild Depression";
    if (score <= 14) return "Moderate Depression";
    if (score <= 19) return "Moderately Severe Depression";
    return "Severe Depression";
  }
};

const TestStatistics = ({ onBack }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const response = await testService.getUserTests(userId);
        if (response.success) setTests(response.tests);
      } catch (err) {
        console.error("Error fetching tests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  if (tests.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No test data available.</Text>
      </View>
    );
  }

  const testTypes = ["GAD-7", "PSS-10", "PHQ-9"];

  return (
    <View style={{ flex: 1, backgroundColor: "#16132D" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Test Statistics</Text>
        </View>


        {testTypes.map((type) => {
          const filtered = tests
            .filter((test) => test.testType === type)
            .sort((a, b) => new Date(a.testDate) - new Date(b.testDate));

          if (filtered.length === 0) return null;

          const scores = filtered.map((t) => t.score);
          const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
          const interpretation = interpretResults(type, avgScore);

          return (
            <View key={type} style={styles.card}>
              <Text style={styles.cardTitle}>{type} Score Progress</Text>
              <Text style={styles.text}>{testDescriptions[type]}</Text>
              <View style={styles.chartWrapper}>
                <LineChart
                  data={{

                    datasets: [{ data: scores }],
                  }}
                  width={screenWidth * 0.8} // lățime relativă (mai echilibrat)
                  height={200}
                  yAxisSuffix=" pts"
                  chartConfig={{
                    backgroundGradientFrom: theme.colors.background,
                    backgroundGradientTo: theme.colors.background,
                    color: (opacity = 1) => `rgba(255, 244, 247, ${opacity})`,

                    strokeWidth: 5,
                    decimalPlaces: 0,
                    propsForDots: {
                      r: "5",
                      strokeWidth: "2",
                      stroke: "#fff",
                    },
                  }}
                  style={{ borderRadius: 12 }}
                  formatYLabel={(val) => `${parseInt(val)}`}
                />
              </View>


              <Text style={styles.interpretation}>
                Average Result: <Text style={styles.bold}>{interpretation}</Text> ({avgScore.toFixed(1)} pts)
              </Text>

              <Text style={styles.subtitle}>Interpretation Guide:</Text>
              {type === "PHQ-9" ? (
  <>
    <Text style={styles.legend}>0-4: None-minimal</Text>
    <Text style={styles.legend}>5-9: Mild</Text>
    <Text style={styles.legend}>10-14: Moderate</Text>
    <Text style={styles.legend}>15-19: Moderately Severe</Text>
    <Text style={styles.legend}>20-27: Severe</Text>
  </>
) : type === "GAD-7" ? (
  <>
    <Text style={styles.legend}>0-4: Minimal Anxiety</Text>
    <Text style={styles.legend}>5-9: Mild Anxiety</Text>
    <Text style={styles.legend}>10-14: Moderate Anxiety</Text>
    <Text style={styles.legend}>15+: Severe Anxiety</Text>
  </>
) : (
  <>
    <Text style={styles.legend}>0-13: Low Stress</Text>
    <Text style={styles.legend}>14-26: Moderate Stress</Text>
    <Text style={styles.legend}>27+: High Stress</Text>
  </>
)}

            </View>
          );
        })}


      </ScrollView>
    </View>
  );
};

export default TestStatistics;
