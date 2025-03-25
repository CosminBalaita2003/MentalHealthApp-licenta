import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { fetchUserEntries } from "../services/journalService";
import journalStyles from "../styles/journalStyles";
import theme from "../styles/theme";

const JournalScreen = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const loadEntries = async () => {
    console.log(" Loading journal entries...");
    setLoading(true);

    try {
      const response = await fetchUserEntries();
      console.log(" Response from fetchUserEntries:", JSON.stringify(response, null, 2)); // 🔥 Vezi structura exactă

      if (response.success && response.entries?.length > 0) {
        setEntries(response.entries);
      } else {
        setEntries([]);
        Alert.alert("Info", "No journal entries found.");
      }
    } catch (error) {
      console.error(" Error in loadEntries:", error);
      Alert.alert("Error", "Something went wrong while loading journal entries.");
    }

    setLoading(false);
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <View style={journalStyles.container}>
      <Text style={journalStyles.header}>Journal</Text>
      <TouchableOpacity
        style={journalStyles.button}
        onPress={() => navigation.navigate("NewEntryScreen")}
      >
        <Text style={journalStyles.buttonText}>+ Add Entry</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : entries.length === 0 ? (
        <Text style={{ textAlign: "center", color: "gray", marginTop: 20 }}>
          No journal entries found.
        </Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={journalStyles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={journalStyles.journalCard}
              onPress={() => Alert.alert(item.emotion?.name ?? "No Emotion", item.content)}
            >
              <Text style={journalStyles.journalEmotionTitle}>{item.emotion?.name ?? "Unknown"}</Text>
              <Text style={journalStyles.journalContentText}>{item.content}</Text>
              <Text style={journalStyles.journalDateText}>{formatDate(item.date)}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default JournalScreen;
