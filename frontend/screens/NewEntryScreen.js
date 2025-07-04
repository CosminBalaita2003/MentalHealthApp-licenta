import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
  Alert,
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
import { getChatCompletion } from "../services/openaiService";

export default function NewEntryScreen() {
  const [content, setContent] = useState("");
  const [emotionId, setEmotionId] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [aiAdvice, setAiAdvice] = useState("");
  const [empatheticMessage, setEmpatheticMessage] = useState("");
const empatheticMessages = [
  "Thank you for showing up for yourself today.",
  "Your emotions are valid and important.",
  "Every word you wrote matters.",
  "You’re doing better than you think.",
  "It’s okay to feel everything you’re feeling.",
  "You’ve taken an important step toward healing.",
  "Your honesty with yourself is powerful.",
  "You are not alone in this journey.",
  "Even small steps count — and this one does too.",
  "Be proud of yourself for expressing how you feel.",
  "You're allowed to take time to reflect.",
  "Writing this down is a form of self-care.",
  "This entry is a quiet act of courage.",
  "You're doing something meaningful just by being here.",
  "One page at a time, you're understanding yourself better."
];

  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const ures = await userService.getUser();
      if (ures.success) setUser(ures.user);
      else {
        Alert.alert("Error", "Failed to load user.");
        setLoading(false);
        return;
      }
      const eres = await fetchEmotions();
      if (eres.success) setEmotions(eres.emotions);
      else Alert.alert("Error", "Failed to load emotions.");
      setLoading(false);
    };
    loadData();
  }, []);

  const splitByPara = (text) =>
    text
      .split(/\n+/)
      .flatMap(p =>
        p.split(/(?<=[.?!])\s+/).map(s => s.trim()).filter(Boolean)
      );

  const handleSubmit = async () => {
    if (!content.trim() || !emotionId) {
      return Alert.alert("Error", "Write something and pick how you feel.");
    }
    if (!user) {
      return Alert.alert("Error", "User missing.");
    }

    setSaving(true);
    try {
      // 1. Save journal entry
      const response = await addJournalEntry(content, emotionId, user);
      if (!response.id) throw new Error("No entry ID returned");

      // 2. Analyze text to detect top 3 emotions
      const sentences = splitByPara(content);
      const counts = {};
      for (const s of sentences) {
        const res = await analyzeTextEmotion(s);
        if (res.success) {
          const em = res.dominantEmotion.toLowerCase();
          counts[em] = (counts[em] || 0) + 1;
        }
        console.log(`Analyzed sentence: "${s}" - Detected emotion: ${res.dominantEmotion}`);
      }

      const sortedEmotions = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([emotion]) => emotion);
      const top3Emotions = sortedEmotions.slice(0, 3);
      setDominantEmotion(top3Emotions[0]);

      // 3. Save emotions separately in backend
      console.log("Detected emotions saved:", top3Emotions);
  for (const emotion of top3Emotions) {
  await saveDetectedEmotion({
    emotionName: emotion,
    sentence: content, // sau poți trece ultima propoziție relevantă
    source: "journal",
    journalEntryId: response.id
  });
}




      // 4. Get AI message from OpenAI
      try {
        const systemMessage = {
          role: "system",
          content: "You are a warm and empathetic mental health coach. Given the user's emotional state, provide a supportive, motivational message that acknowledges their feelings."
        };
        const userMessage = {
          role: "user",
          content: `The user wrote a journal. The top detected emotions are: ${top3Emotions.join(", ")}. Based on this, write a compassionate and encouraging message.`
        };
        const aiResponse = await getChatCompletion([systemMessage, userMessage]);
        setAiAdvice(aiResponse);
      } catch (e) {
        console.warn("OpenAI failed:", e.message);
        setAiAdvice("Be kind to yourself today. Emotions are valid and you're not alone.");
      }
      const randomMessage = empatheticMessages[Math.floor(Math.random() * empatheticMessages.length)];
setEmpatheticMessage(randomMessage);
      // 5. Show confirmation modal
      setConfirmationVisible(true);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not save entry.");
    } finally {
      setSaving(false);
    }
  };

  const handleFinalSave = () => {
    setConfirmationVisible(false);
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={JournalStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={JournalStyles.title}>How Are You Feeling Today?</Text>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <View style={{ flex: 1, width: "100%" }}>
            <JournalTextBox value={content} onChangeText={setContent} />
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

        {/* Saving overlay */}
        <Modal visible={saving} transparent>
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color={theme.colors.semiaccent} />
              <Text style={styles.loadingText}>Saving your entry…</Text>
            </View>
          </View>
        </Modal>

        {/* Confirmation modal */}
        <Modal visible={confirmationVisible} transparent animationType="fade">
          <View style={styles.errorOverlay}>
            <View style={styles.errorContent}>
              <Text style={styles.modalTitle}>{empatheticMessage}</Text>
              <Text style={styles.modalDescription}>{aiAdvice}</Text>
              <TouchableOpacity
                style={styles.errorButton}
                onPress={handleFinalSave}
              >
                <Text style={styles.errorButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.64)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    width: "80%",
    backgroundColor: "#1E1A38",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    color: theme.colors.text,
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 5,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.64)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  errorContent: {
    backgroundColor: "#1E1A38",
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
    width: "100%",
    borderWidth: 2,
    borderColor: "#E8BCB9",
    shadowColor: "#9f7aea",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E8BCB9",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    color: "#E8BCB9",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  errorButton: {
    marginTop: 20,
    backgroundColor: "#E8BCB9",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "center",
  },
  errorButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
