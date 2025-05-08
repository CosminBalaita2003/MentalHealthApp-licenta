import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import userService from "../services/userService";
import {
  analyzeTextEmotion,
  fetchEmotions,
  addJournalEntry
} from "../services/journalService";
import JournalStyles from "../styles/journalStyles";
import theme from "../styles/theme";
import EmotionSelector from "../components/EmotionSelector";
import JournalTextBox from "../components/JournalTextBox";
import { saveDetectedEmotion } from "../services/emotionService";
const NewEntryScreen = () => {
  const [content, setContent] = useState("");
  const [emotionId, setEmotionId] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [detectedEmotions, setDetectedEmotions] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const userResponse = await userService.getUser();
      if (userResponse.success) {
        setUser(userResponse.user);
      } else {
        Alert.alert("Error", "Failed to load user data.");
        setLoading(false);
        return;
      }

      const emotionsResponse = await fetchEmotions();
      if (emotionsResponse.success) {
        setEmotions(emotionsResponse.emotions);
      } else {
        Alert.alert("Error", emotionsResponse.message || "Failed to load emotions.");
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const splitByParagraphs = (text) => {
    return text
      .split(/\n+/) // separă pe paragrafe
      .flatMap(paragraph =>
        paragraph
          .split(/(?<=[.?!])\s+/) // apoi în fraze
          .map(p => p.trim())
          .filter(Boolean)
      );
  };
  

  const analyzeTextLive = async (text) => {
    if (!text.trim()) {
      setDetectedEmotions([]);
      return;
    }

    setAnalyzing(true);

    const sentences = splitByParagraphs(text);
    const emotionCounts = {};

    for (const sentence of sentences) {
      const result = await analyzeTextEmotion(sentence);
      if (result.success) {
        const emotion = result.dominantEmotion.toLowerCase();
        if (emotion in emotionCounts) {
          emotionCounts[emotion]++;
        } else {
          emotionCounts[emotion] = 1;
        }
      }
    }

    const sorted = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3); // Top 3 emoții

    setDetectedEmotions(sorted);
    setAnalyzing(false);
    for (const [emotionName, count] of sorted) {
      await saveDetectedEmotion({
        emotionName,
        sentence: null,      // nu mai salvăm propoziția în top
        source: "journal"    // doar informativ
      });
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() || !emotionId) {
      Alert.alert("Error", "Please write your journal entry and select how you feel.");
      return;
    }
  
    if (!user) {
      Alert.alert("Error", "User data is missing.");
      return;
    }
  
    try {
      setLoading(true);
  
      const sentences = splitByParagraphs(content);
      const emotionCounts = {};
  
      console.log("📓 Full Journal Text:\n", content);
      console.log("✂️ Split Sentences:", sentences);
  
      for (const sentence of sentences) {
        const result = await analyzeTextEmotion(sentence);
        if (result.success) {
          const emotion = result.dominantEmotion.toLowerCase();
          console.log(`📍 "${sentence}" → 🤖 ${emotion}`);
          console.log(`   Scores:`, result.scores);
  
          if (emotion in emotionCounts) {
            emotionCounts[emotion]++;
          } else {
            emotionCounts[emotion] = 1;
          }
        } else {
          console.log(`❌ Failed to analyze sentence: "${sentence}"`);
        }
      }
  
      const sortedEmotions = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
  
      // 💾 1. Salvează jurnalul înainte
      const response = await addJournalEntry(content, emotionId, user);
      const journalEntryId = response?.id;
  
      if (!journalEntryId) {
        throw new Error("Failed to retrieve journal entry ID");
      }
  
      // 🧠 2. Trimite emoțiile legate de jurnal
      for (const [emotionName] of sortedEmotions) {
        await saveDetectedEmotion({
          emotionName,
          sentence: null,
          source: "journal",
          journalEntryId, // ✅ atașează jurnalul
        });
      }
  
      Alert.alert("Success", response.message || "Entry saved!");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding journal entry:", error);
      Alert.alert("Error", "Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={JournalStyles.container} keyboardShouldPersistTaps="handled">
        <Text style={JournalStyles.title}>New Journal Entry</Text>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <View style={{ flex: 1, width: "100%" }}>
            <JournalTextBox
              value={content}
              onChangeText={(text) => {
                setContent(text);
                analyzeTextLive(text);
              }}
            />

           

            <EmotionSelector
              emotions={emotions}
              selectedEmotionId={emotionId}
              onSelectEmotion={setEmotionId}
            />

            <TouchableOpacity
              style={JournalStyles.button}
              onPress={handleSubmit}
            >
              <Text style={JournalStyles.buttonText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default NewEntryScreen;
