import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import GlobalStyles from "../styles/globalStyles";
import testService from "../services/testService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

const testDescriptions = {
  "GAD-7": "The GAD-7 (Generalized Anxiety Disorder) test measures the severity of anxiety symptoms.",
  "PSS-10": "The PSS-10 (Perceived Stress Scale) test evaluates your perceived stress over the past month.",
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
  return "Unknown";
};

const TestStatistics = ({ onBack }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;
      const response = await testService.getUserTests(userId);
      if (response.success) setTests(response.tests);
    } catch (err) {
      console.error("❌ Eroare la încărcarea testelor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  if (loading) {
    return (
      <View style={GlobalStyles.infoContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  if (tests.length === 0) {
    return (
      <View style={GlobalStyles.infoContainer}>
        <Text style={GlobalStyles.text}>No test data available.</Text>
      </View>
    );
  }

  const testTypes = ["GAD-7", "PSS-10"];

  return (
    <View style={{ flex: 1, backgroundColor: "#16132D", paddingBottom: 100 }}>
      <ScrollView contentContainerStyle={[GlobalStyles.statsContainer, { paddingBottom: 150 }]}>
        <Text style={[GlobalStyles.title, { textAlign: "center", marginBottom: 20, marginTop: 50 }]}>
          Test Statistics
        </Text>

        {testTypes.map((type) => {
          const filteredTests = tests
          .filter((test) => test.testType === type)
          .sort((a, b) => new Date(a.testDate) - new Date(b.testDate));
        

          if (filteredTests.length === 0) return null;

          const scores = filteredTests.map((test) => test.score);
          const averageScore = scores.reduce((acc, val) => acc + val, 0) / scores.length;
          const interpretation = interpretResults(type, averageScore);

          return (
            <View key={type} style={[GlobalStyles.chartContainer, { marginBottom: 30 }]}>
              <Text style={[GlobalStyles.subtitle, { fontSize: 20, textAlign: "center", marginBottom: 10 }]}>
                {type} Score Progress
              </Text>
              <Text style={[GlobalStyles.text, { textAlign: "center", marginBottom: 15 }]}>
                {testDescriptions[type]}
              </Text>

              <LineChart
                data={{
                  labels: Array(filteredTests.length).fill(""),

                  datasets: [{ data: scores }],
                }}
                width={screenWidth * 0.9}
                height={220}
                yAxisSuffix=" pts"
                chartConfig={{
                  backgroundGradientFrom: "#202040",
                  backgroundGradientTo: "#16132D",
                  color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
                  strokeWidth: 3,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  decimalPlaces: 0,
                  propsForDots: {
                    r: "5",
                    strokeWidth: "2",
                    stroke: "#4ECDC4",
                  },
                  propsForBackgroundLines: {
                    stroke: "rgba(255, 255, 255, 0.2)",
                  },
                }}
                style={{
                  marginVertical: 10,
                  borderRadius: 10,
                  padding: 10,
                  backgroundColor: "#1D1A39",
                }}
                formatYLabel={(value) => value}
              />

<View style={GlobalStyles.interpretationContainer}>
  <Text style={[GlobalStyles.subtitle]}>
    Average {type} Result:
  </Text>
  <Text style={[GlobalStyles.interpretationText, { marginTop: 8 }]}>
    {interpretation} ({averageScore.toFixed(1)} pts)
  </Text>
</View>

<View style={GlobalStyles.legendContainer}>
  <Text style={[GlobalStyles.subtitle, { fontSize: 16, textAlign: "center", marginBottom: 5 }]}>
    Interpretation Guide:
  </Text>
  {type === "GAD-7" ? (
    <>
      <Text style={GlobalStyles.legendText}>0-4: Minimal Anxiety</Text>
      <Text style={GlobalStyles.legendText}>5-9: Mild Anxiety</Text>
      <Text style={GlobalStyles.legendText}>10-14: Moderate Anxiety</Text>
      <Text style={GlobalStyles.legendText}>15+: Severe Anxiety</Text>
    </>
  ) : (
    <>
      <Text style={GlobalStyles.legendText}>0-13: Low Stress</Text>
      <Text style={GlobalStyles.legendText}>14-26: Moderate Stress</Text>
      <Text style={GlobalStyles.legendText}>27-40: High Stress</Text>
    </>
  )}
</View>
              
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={GlobalStyles.backButton} onPress={onBack}>
        <Text style={[GlobalStyles.buttonText, { color: "#16132D", fontSize: 18 }]}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestStatistics;
