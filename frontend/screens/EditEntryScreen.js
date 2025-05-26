import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
   Modal,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import userService from "../services/userService";
import { fetchEmotions, updateJournalEntry } from "../services/journalService";
import JournalStyles from "../styles/journalStyles";
import theme from "../styles/theme";
import EmotionSelector from "../components/EmotionSelector";
import JournalTextBox from "../components/JournalTextBox";

const EditEntryScreen = () => {
  const [content, setContent] = useState("");
  const [emotionId, setEmotionId] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const entry = route.params?.entry;

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

      if (entry) {
        setContent(entry.content);
        setEmotionId(entry.emotionId);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const handleSubmit = async () => {
    if (!content.trim() || !emotionId) {
      Alert.alert("Error", "Please enter your journal entry and select an emotion.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User data is missing.");
      return;
    }
 setSaving(true);
    try {
      // 🔧 Reconstruim city manual din cityId și cityName
      const updatedEntry = {
        ...entry,
        content,
        emotionId,
        user
      };


      const response = await updateJournalEntry(updatedEntry, user);


      console.log("Update Success:", response);

        setConfirmationVisible(true);

     
    } catch (error) {
      console.error("Error updating journal entry:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Could not update the entry.");
    }
    finally {
      setSaving(false);
    }
  };
 const handleConfirm = () => {
    setConfirmationVisible(false);
    navigation.goBack();
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={JournalStyles.container}>
        <Text style={JournalStyles.title}>Edit Journal Entry</Text>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <View style={{ flex: 1, justifyContent: "center", width: "100%" }}>
            <JournalTextBox value={content} onChangeText={setContent} />
            <EmotionSelector
              emotions={emotions}
              selectedEmotionId={emotionId}
              onSelectEmotion={setEmotionId}
            />
            <TouchableOpacity style={JournalStyles.button} onPress={handleSubmit}>
              <Text style={JournalStyles.buttonText}>Update Entry</Text>
            </TouchableOpacity>
          </View>
        )}
          {/* Loading overlay */}
        <Modal visible={saving} transparent>
          <View style={JournalStyles.ModalJournalLoadingOverlay}>
            <View style={JournalStyles.ModalJournalLoadingContent}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={JournalStyles.ModalJournalLoadingText}>
                Saving your entry…
              </Text>
            </View>
          </View>
        </Modal>

        {/* Confirmation modal */}
        <Modal
          visible={confirmationVisible}
          transparent
          animationType="fade"
        >
          <View style={JournalStyles.ModalJournalConfirmationOverlay}>
            <View style={JournalStyles.ModalJournalConfirmationContent}>
              <Text style={JournalStyles.ModalJournalConfirmationTitle}>
                Entry updated successfully!
              </Text>
              <TouchableOpacity
                style={JournalStyles.ModalJournalConfirmationButton}
                onPress={handleConfirm}
              >
                <Text style={JournalStyles.ModalJournalConfirmationButtonText}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditEntryScreen;
