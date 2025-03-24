import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GlobalStyles from "../styles/globalStyles";
import MorphingImage from "./MorphingImage";

const EmotionSelector = ({ emotions = [], selectedEmotionId, onSelectEmotion }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (emotions.length > 0 && !selectedEmotionId) {
      onSelectEmotion(emotions[0].id);
    }
  }, [emotions]);

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
    <View style={GlobalStyles.carouselContainer}>
      <Text style={GlobalStyles.subtitle}>Emoția ta curentă</Text>
      <View style={GlobalStyles.carouselContent}>
        <TouchableOpacity onPress={() => handleChange("prev")}>
          <Ionicons name="chevron-back" size={32} color="#fff" />
        </TouchableOpacity>

        <View style={GlobalStyles.emotionCard}>
          <MorphingImage
            fromUri={previousEmotion.imagePath}
            toUri={currentEmotion.imagePath}
            trigger={trigger}
          />
          <Text style={GlobalStyles.emotionText}>{currentEmotion.name}</Text>
        </View>

        <TouchableOpacity onPress={() => handleChange("next")}>
          <Ionicons name="chevron-forward" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmotionSelector;
