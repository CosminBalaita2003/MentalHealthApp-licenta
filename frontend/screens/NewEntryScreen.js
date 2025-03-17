import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../styles/globalStyles";
import theme from "../styles/theme";

const NewEntryScreen = () => {
  const [content, setContent] = useState("");
  const [emotionId, setEmotionId] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchEmotions();
  }, []);

  const fetchEmotions = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await axios.get(`${process.env.API_URL}/api/Emotion`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🟢 API Response:", response.data);

      const emotionsArray = response.data?.$values ?? [];
      setEmotions(emotionsArray);
    } catch (error) {
      console.error("🔴 Error fetching emotions:", error);
      Alert.alert("Error", "Failed to fetch emotions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() || !emotionId) {
      Alert.alert("Error", "Please enter your journal entry and select an emotion.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      await axios.post(
        `${process.env.API_URL}/api/JournalEntry`,
        { content, emotionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Entry added successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("🔴 Error submitting journal entry:", error);
      Alert.alert("Error", "Failed to add journal entry.");
    }
  };

  return (
    <View style={[GlobalStyles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={GlobalStyles.title}>New Journal Entry</Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <>
          <TextInput
            style={[GlobalStyles.input, { height: 120 }]}
            placeholder="Write your thoughts here..."
            multiline
            value={content}
            onChangeText={setContent}
          />

          <Text style={GlobalStyles.text}>Select Emotion:</Text>
          <View style={GlobalStyles.pickerContainer}>
            {emotions.length > 0 ? (
              <Picker
                selectedValue={emotionId}
                onValueChange={(itemValue) => setEmotionId(itemValue)}
                style={GlobalStyles.picker}
              >
                <Picker.Item label="Select an emotion" value={null} />
                {emotions.map((emotion) => (
                  <Picker.Item key={emotion.id} label={emotion.name} value={emotion.id} />
                ))}
              </Picker>
            ) : (
              <Text style={{ color: "gray", textAlign: "center" }}>No emotions found</Text>
            )}
          </View>

          <TouchableOpacity style={GlobalStyles.button} onPress={handleSubmit}>
            <Text style={GlobalStyles.buttonText}>Save Entry</Text>
          </TouchableOpacity>
        </>
      )}
      
      </View>
    
  );
}

export default NewEntryScreen;
