import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import JournalStyles from "../styles/journalStyles";
import MorphingImage from "./MorphingImage";

const EmotionSelector = ({ emotions = [], selectedEmotionId, onSelectEmotion }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (emotions.length > 0) {
      if (selectedEmotionId) {
        const index = emotions.findIndex(e => e.id === selectedEmotionId);
        if (index !== -1) {
          setCurrentIndex(index);
        }
      } else {
        onSelectEmotion(emotions[0].id);
      }
    }
  }, [emotions, selectedEmotionId]);
  

  const handleChange = (direction) => {
    if (emotions.length === 0) return;
    const nextIndex =
      direction === "next"
        ? (currentIndex + 1) % emotions.length
        : (currentIndex - 1 + emotions.length) % emotions.length;

    setCurrentIndex(nextIndex);
    onSelectEmotion(emotions[nextIndex].id);
    setTrigger((prev) => prev + 1); // forțează re-renderul MorphingImage
  };

  if (emotions.length === 0) return null;

  const currentEmotion = emotions[currentIndex];
  const previousEmotion = emotions[(currentIndex - 1 + emotions.length) % emotions.length];

  return (
    <View style={JournalStyles.carouselContainer}>
      <Text style={JournalStyles.subtitle}>Emoția ta curentă</Text>
      <View style={JournalStyles.carouselContent}>
        <TouchableOpacity onPress={() => handleChange("prev")}>
          <Ionicons name="chevron-back" size={32} color="#fff" />
        </TouchableOpacity>

        <View style={JournalStyles.emotionCard}>
          <MorphingImage
            fromUri={previousEmotion.imagePath}
            toUri={currentEmotion.imagePath}
            trigger={trigger}
          />
          <Text style={JournalStyles.emotionText}>{currentEmotion.name}</Text>
        </View>

        <TouchableOpacity onPress={() => handleChange("next")}>
          <Ionicons name="chevron-forward" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmotionSelector;
