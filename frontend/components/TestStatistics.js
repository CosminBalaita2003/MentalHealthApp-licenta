import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from "react-native";
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
// sus, în componentă (în afara return-ului):
const renderMarkdownBold = (str) => {
  // împarte păstrând și delimitatorii **...**
  const tokens = str.split(/(\*\*[^*]+\*\*)/g);

  return tokens.map((tok, i) => {
    const match = tok.match(/^\*\*(.+)\*\*$/);
    if (match) {
      // e segment bold
      return (
        <Text key={i} style={styles.bold}>
          {match[1]}
        </Text>
      );
    } else {
      // text normal
      return <Text key={i}>{tok}</Text>;
    }
  });
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
  } else if (testType === "PHQ-9") {
    if (score <= 4) return "Minimal Depression";
    if (score <= 9) return "Mild Depression";
    if (score <= 14) return "Moderate Depression";
    if (score <= 19) return "Moderately Severe Depression";
    return "Severe Depression";
  }
};

// explicații detaliate și recomandări pentru fiecare categorie
const testDetails = {
  "GAD-7": {
    "Minimal Anxiety": `
You’re experiencing very few symptoms of anxiety. Your overall day-to-day life is unlikely to be significantly impacted.
  
**Recommendations:**
- Maintain regular physical activity.
- Practice brief breathing exercises when you notice tension.
- Keep monitoring your feelings - early detection helps keep anxiety minimal.
    `,
    "Mild Anxiety": `
You’re noticing occasional anxiety symptoms - like feeling nervous or having trouble relaxing - several days a week.

**Recommendations:**
- Introduce a short mindfulness or meditation practice (5–10 minutes daily).
- Limit caffeine and screen-time before bed.
- Talk about your worries with someone you trust.
    `,
    "Moderate Anxiety": `
Your anxiety symptoms are more frequent/intense and may interfere with work or social activities.

**Recommendations:**
- Consider weekly relaxation techniques (e.g., guided imagery, progressive muscle relaxation).
- Set aside “worry time” - 15 minutes per day to process anxious thoughts.
- If symptoms persist, consult a mental health professional.
    `,
    "Severe Anxiety": `
You’re experiencing daily, intense anxiety that likely disrupts your ability to focus or sleep.

**Recommendations:**
- Seek professional support (therapist, counselor) as soon as possible.
- Explore structured therapies: CBT (Cognitive Behavioral Therapy) or mindfulness-based stress reduction.
- Reach out to your support network; don’t face severe anxiety alone.
    `,
  },
  "PSS-10": {
    "Low Stress": `
Your perceived stress level is low. You probably have good strategies for managing daily pressures.

**Recommendations:**
- Continue current routines that support relaxation.
- Keep balancing work/leisure time.
- Maintain social connections for ongoing support.
    `,
    "Moderate Stress": `
You often feel stressed and may find it hard to unwind at times.

**Recommendations:**
- Schedule short breaks during your day (5–10 minutes) to recharge.
- Try journaling: write down top 3 stressors each evening.
- Incorporate light exercise - walking, stretching - to clear your mind.
    `,
    "High Stress": `
Your stress level is high and may be negatively affecting your mood or relationships.

**Recommendations:**
- Prioritize tasks: break projects into smaller steps.
- Practice daily relaxation routines (e.g., yoga, deep breathing).
- Consider talking with a coach or counselor to develop coping strategies.
    `,
  },
  "PHQ-9": {
    "Minimal Depression": `
Your mood is generally positive with very few depressive symptoms.

**Recommendations:**
- Keep up activities you enjoy.
- Stay socially active.
- Continue self-care habits that support your mood.
    `,
    "Mild Depression": `
You’re experiencing some depressive symptoms, like low mood or less interest in activities.

**Recommendations:**
- Engage in pleasant activities - even if you don’t feel like it at first.
- Keep a gratitude journal (write 3 things you’re thankful for daily).
- Discuss feelings with a friend or family member.
    `,
    "Moderate Depression": `
Depressive symptoms are moderate and may impact your motivation and daily functioning.

**Recommendations:**
- Establish a regular sleep schedule.
- Set small, achievable goals each day.
- Consider short-term therapy or online counseling resources.
    `,
    "Moderately Severe Depression": `
Your symptoms are significant: you may have trouble performing usual tasks.

**Recommendations:**
- Reach out for professional help (therapy, GP for evaluation).
- Build a support system: share your feelings openly.
- Explore behavioural activation - scheduling enjoyable tasks daily.
    `,
    "Severe Depression": `
Your symptoms are intense and likely interfering substantially with your life.

**Recommendations:**
- Seek immediate professional support (therapist, psychiatrist).
- If you have thoughts of self-harm, contact emergency services or a crisis line.
- Don’t isolate - keep in touch with trusted friends or family.
    `,
  },
};

const TestStatistics = ({ onBack }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ type: "", avgScore: 0, interpretation: "" });

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const response = await testService.getUserTests(userId);
        if (response.success) setTests(response.tests);
      } catch (err) {
        console.log("Error fetching tests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#E8BCB9" />
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
  const detailText =
  testDetails[modalData.type]?.[modalData.interpretation] || "";
  const openDetailModal = (type, avgScore) => {
    const interp = interpretResults(type, avgScore);
    setModalData({ type, avgScore, interpretation: interp });
    setModalVisible(true);
  };

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
            .filter((t) => t.testType === type)
            .sort((a, b) => new Date(a.testDate) - new Date(b.testDate));
          if (!filtered.length) return null;

          const scores = filtered.map((t) => t.score);
          const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
          return (
            <TouchableOpacity
              key={type}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => openDetailModal(type, avgScore)}
            >
              <Text style={styles.cardTitle}>{type} Score Progress</Text>
              <Text style={styles.text}>{testDescriptions[type]}</Text>
              <View style={styles.chartWrapper}>
                <LineChart
                  data={{ datasets: [{ data: scores }] }}
                  width={screenWidth * 0.8}
                  height={200}
                  yAxisSuffix=" pts"
                  chartConfig={{
                    backgroundGradientFrom: theme.colors.background,
                    backgroundGradientTo: theme.colors.background,
                    color: (opacity = 1) => `rgba(255, 244, 247, ${opacity})`,
                    strokeWidth: 5,
                    decimalPlaces: 0,
                    propsForDots: { r: "5", strokeWidth: "2", stroke: "#fff" },
                  }}
                  style={{ borderRadius: 12 }}
                  formatYLabel={(val) => `${parseInt(val)}`}
                />
              </View>
              <Text style={styles.interpretation}>
                Average Result: <Text style={styles.bold}>{interpretResults(type, avgScore)}</Text> ({avgScore.toFixed(1)} pts)
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Modal
  visible={modalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>
        {modalData.type}  -  {modalData.interpretation}
      </Text>
      <Text style={styles.modalDescription}>
        {testDescriptions[modalData.type]}
      </Text>

      {/* Scrollable area pentru textul detaliat */}
      <ScrollView
        style={{ marginVertical: 12 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/**
         * Împărțim detaliile pe paragrafe și le afișăm separat
         */}
        {detailText
  .split("\n\n")
  .map((para, i) => (
    <Text key={i} style={styles.modalText}>
      {renderMarkdownBold(para.trim())}
    </Text>
  ))
}

      </ScrollView>

      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.modalButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
};

export default TestStatistics;
