import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { fetchUserEntries } from "../services/journalService";
import journalStyles from "../styles/journalStyles";
import theme from "../styles/theme";
import { Ionicons } from "@expo/vector-icons"; // pentru iconul de edit

const JournalScreen = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null); // 🔥 pentru modal
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const loadEntries = async () => {
    setLoading(true);

    try {
      const response = await fetchUserEntries();
      if (response.success && response.entries?.length > 0) {
        setEntries(response.entries);
      } else {
        setEntries([]);
        console.log("Info", "No journal entries found.");
      }
    } catch (error) {
      console.log(" Error in loadEntries:", error);
      console.log("Error", "Something went wrong while loading journal entries.");
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

  const handleEntryPress = (entry) => {
    setSelectedEntry(entry);
    setModalVisible(true);
  };

  const handleEdit = () => {

    navigation.navigate("EditEntryScreen", { entry: selectedEntry });
    setModalVisible(false);
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
              onPress={() => handleEntryPress(item)}
            >
              {/* <Text style={journalStyles.journalEmotionTitle}>Your Emotion: {item.emotion?.name ?? "Unknown"}</Text> */}
              <Text style={journalStyles.journalContentText}>{item.content}</Text>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={journalStyles.journalEmotionLabel}>
                  Your Emotion:{" "}
                  <Text style={journalStyles.journalEmotionValue}>
                    {item.emotion?.name ?? "Unknown"}
                  </Text>
                </Text>

                <Text style={journalStyles.journalDateText}>
                  {formatDate(item.date)}
                </Text>
              </View>

            </TouchableOpacity>
          )}
        />
      )}

      {/* 🔥 Modal nativ scrollabil */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.2)",
          justifyContent: "flex-end"
        }}>
          <View style={{
            backgroundColor: theme.colors.backgroundLight,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            height: "80%",


          }}>
            <TouchableOpacity
              onPress={handleEdit}
              style={{ position: "absolute", top: 10, right: 10 }}
            >
              <Ionicons name="pencil" size={22} color={theme.colors.text} />
            </TouchableOpacity>

            <ScrollView>
              <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10, color: theme.colors.text }}>
                {selectedEntry?.emotion?.name ?? "Emotion"}
              </Text>
              <Text style={{ color: "gray", marginBottom: 10 }}>
                {formatDate(selectedEntry?.date)}
              </Text>
              <Text style={{ fontSize: 16, lineHeight: 22, color: theme.colors.text }}>
                {selectedEntry?.content}
              </Text>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 15,
                alignSelf: "center",
                backgroundColor: theme.colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 10
              }}
            >
              <Text style={{ color: "white" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default JournalScreen;
