import React, { useState, useRef, useEffect } from "react";
import { View, Text, Animated, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GlobalStyles from "../styles/globalStyles";

const EmotionSelector = ({ emotions = [], selectedEmotionId, onSelectEmotion }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousImage, setPreviousImage] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

    setPreviousImage(emotions[currentIndex].imagePath);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex(nextIndex);
      onSelectEmotion(emotions[nextIndex].id);

      fadeAnim.setValue(0);
      scaleAnim.setValue(1.2);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  if (emotions.length === 0) {
    return (
      <View style={GlobalStyles.carouselContainer}>
        <Text style={GlobalStyles.subtitle}>Nu există emoții disponibile</Text>
      </View>
    );
  }

  const currentEmotion = emotions[currentIndex];

  return (
    <View style={GlobalStyles.carouselContainer}>
      <Text style={GlobalStyles.subtitle}>Emoția ta curentă</Text>
      <View style={GlobalStyles.carouselContent}>
        <TouchableOpacity onPress={() => handleChange("prev")}>
          <Ionicons name="chevron-back" size={32} color="#fff" />
        </TouchableOpacity>

        <View style={GlobalStyles.emotionCard}>
          {previousImage && (
            <Animated.Image
              source={{ uri: previousImage }}
              style={[
                GlobalStyles.emotionImage,
                {
                  position: "absolute",
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  }),
                  transform: [
                    {
                      scale: scaleAnim.interpolate({
                        inputRange: [0.85, 1.2],
                        outputRange: [1, 0.95],
                      }),
                    },
                  ],
                },
              ]}
            />
          )}

          <Animated.Image
            source={{ uri: currentEmotion.imagePath }}
            style={[
              GlobalStyles.emotionImage,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
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
