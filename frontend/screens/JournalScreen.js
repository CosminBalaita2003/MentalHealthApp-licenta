import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import GlobalStyles from "../styles/globalStyles";
import theme from "../styles/theme";

const JournalScreen = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await axios.get(`${process.env.API_URL}/api/JournalEntry/UserEntries`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEntries(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch journal entries.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[GlobalStyles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity 
        style={[GlobalStyles.button, { marginBottom: 10 }]}
        onPress={() => navigation.navigate("NewEntryScreen")}
      >
        <Text style={GlobalStyles.buttonText}>+ Add Entry</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={GlobalStyles.card}
              onPress={() => navigation.navigate("EntryDetailScreen", { entry: item })}
            >
              <Text style={GlobalStyles.cardTitle}>{item.emotion.name}</Text>
              <Text style={GlobalStyles.cardText}>
                {item.content.length > 100 ? item.content.substring(0, 100) + "..." : item.content}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default JournalScreen;
