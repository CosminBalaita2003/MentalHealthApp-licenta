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

const emotionMessages = {
  anger:        "Anger is valid. Let it out in a healthy way! Don't bottle it up. ",
  disgust:      "Disgust is a natural response. Acknowledge it! It's okay to feel this way. ",
  fear:        "Believe in yourself. You’ve got this! You are stronger than you think. ",
  joy:        "Joy is a wonderful feeling. Embrace it!  Celebrate the little things. ",
  neutral:     "Neutral is okay sometimes it’s good to just be. Don't feel pressured to feel something. ",
  sadness:          "It’s okay to feel sad. Be gentle with yourself. It's okay to take a break. ",
  surprise:            "Surprise can be exciting. What’s next?  Embrace the unexpected! ",
  
};

export default function NewEntryScreen() {
  const [content, setContent]           = useState("");
  const [emotionId, setEmotionId]       = useState(null);
  const [emotions, setEmotions]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [user, setUser]                 = useState(null);
  const [analyzing, setAnalyzing]       = useState(false);

  // States for the new flow:
  const [saving, setSaving]             = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [dominantEmotion, setDominantEmotion]         = useState(null);

  const navigation = useNavigation();

  // Load user + emotions on mount
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

  // Utility to split text
  const splitByPara = (text) =>
    text
      .split(/\n+/)
      .flatMap(p =>
        p.split(/(?<=[.?!])\s+/).map(s => s.trim()).filter(Boolean)
      );

  // Submit handler: 1) send to backend, 2) compute dominant emotion, 3) show confirmation
  const handleSubmit = async () => {
    if (!content.trim() || !emotionId) {
      return Alert.alert("Error", "Write something and pick how you feel.");
    }
    if (!user) {
      return Alert.alert("Error", "User missing.");
    }

    setSaving(true);
    try {
      // 1) Save the journal entry
      const response = await addJournalEntry(content, emotionId, user);
      if (!response.id) throw new Error("No entry ID returned");

      // 2) Analyze text to find dominant emotion
      const sentences = splitByPara(content);
      const counts = {};
      for (const s of sentences) {
        const res = await analyzeTextEmotion(s);
        if (res.success) {
          console.log(`Analyzed sentence: "${s}" -> ${res.dominantEmotion}`);
          const em = res.dominantEmotion.toLowerCase();
          counts[em] = (counts[em]||0) + 1;
        }
      }
      // pick the top one
      const dominant = Object.entries(counts)
        .sort((a,b)=>b[1]-a[1])[0]?.[0] ?? null;
      setDominantEmotion(dominant);

      // 3) show the confirmation modal
      setConfirmationVisible(true);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not save entry.");
    } finally {
      setSaving(false);
    }
  };

  // Final save confirmation
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
            <JournalTextBox
              value={content}
              onChangeText={setContent}
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

        {/* Saving overlay */}
        <Modal visible={saving} transparent>
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <ActivityIndicator
                size="large"
                color={theme.colors.semiaccent}
              />
              <Text style={styles.loadingText}>Saving your entry…</Text>
            </View>
          </View>
        </Modal>

        {/* Confirmation modal */}
        <Modal visible={confirmationVisible} transparent animationType="fade">
          <View style={styles.errorOverlay}>
            <View style={styles.errorContent}>
              <Text style={styles.modalTitle}>
                You seem to feel{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {dominantEmotion}
                </Text>
              </Text>
              <Text style={styles.modalDescription}>
                {emotionMessages[dominantEmotion] ?? ""}
              </Text>
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

  // we reuse the errorOverlay & errorContent styles for the confirmation
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
    alignSelf: "flex-center",
  },
  errorButtonText: {
     color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
