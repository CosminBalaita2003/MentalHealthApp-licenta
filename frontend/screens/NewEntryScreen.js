import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import userService from "../services/userService"; //  Importă serviciul userService
import { fetchEmotions, addJournalEntry } from "../services/journalService";
import GlobalStyles from "../styles/globalStyles";
import theme from "../styles/theme";
import EmotionSelector from "../components/EmotionSelector";
import JournalTextBox from "../components/JournalTextBox";

const NewEntryScreen = () => {
  const [content, setContent] = useState("");
  const [emotionId, setEmotionId] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); //  Stochează user-ul complet
  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      //  Obține utilizatorul
      const userResponse = await userService.getUser();
      if (userResponse.success) {
        setUser(userResponse.user); //  Stochează user-ul
      } else {
        Alert.alert("Error", "Failed to load user data.");
        setLoading(false);
        return;
      }

      //  Obține emoțiile
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

  const handleSubmit = async () => {
    if (!content.trim() || !emotionId) {
      Alert.alert("Error", "Please enter your journal entry and select an emotion.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User data is missing. Please log in again.");
      return;
    }

    try {
      console.log(" Sending data:", { content, emotionId, user });

      const response = await addJournalEntry(content, emotionId, user);
      console.log(" Success:", response);
      Alert.alert("Success", response.message);
      navigation.goBack();
    } catch (error) {
      console.error(" Error adding journal entry:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "An error occurred while saving the entry.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[GlobalStyles.container]}>
        <Text style={GlobalStyles.title}>New Journal Entry</Text>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <View style={{ flex: 1, justifyContent: "center", width: "100%" }}>
            <JournalTextBox value={content} onChangeText={setContent} />
            <EmotionSelector emotions={emotions} selectedEmotionId={emotionId} onSelectEmotion={setEmotionId} />
            <TouchableOpacity style={GlobalStyles.button} onPress={handleSubmit}>
              <Text style={GlobalStyles.buttonText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewEntryScreen;
