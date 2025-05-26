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
    return date.toLocaleDateString("en-RO", {
      timeZone: "Europe/Bucharest",
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      

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
  <View style={journalStyles.emptyContainer}>
    <Text style={journalStyles.emptyTitle}>No journal entries found.</Text>
    <Text style={journalStyles.emptySubtitle}>Welcome to your safe haven. Here, you can pour out your heart. Share your joys, your worries, or anything in between, without a hint of judgment. This is your moment to be completely yourself.</Text>
  </View>
) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={journalStyles.listContainer}
          showsVerticalScrollIndicator={false}
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
  animationType="fade"
  transparent={true}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={journalStyles.ModalJournalOverlay}>
    <View style={journalStyles.ModalJournalContent}>
      <TouchableOpacity
        onPress={handleEdit}
        style={journalStyles.ModalJournalEditButton}
      >
        <Ionicons name="pencil" size={22} color={theme.colors.text} />
      </TouchableOpacity>

      <ScrollView showsHorizontalScrollIndicator={false}>
        <Text style={journalStyles.ModalJournalTitle}>
          {selectedEntry?.emotion?.name ?? "Emotion"}
        </Text>
        <Text style={journalStyles.ModalJournalDate}>
          {formatDate(selectedEntry?.date)}
        </Text>
        <Text style={journalStyles.ModalJournalDescription}>
          {selectedEntry?.content}
        </Text>
      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalVisible(false)}
        style={journalStyles.ModalJournalCloseButton}
      >
        <Text style={journalStyles.ModalJournalCloseText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
};

export default JournalScreen;
