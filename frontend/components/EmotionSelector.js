// components/EmotionSelector.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import JournalStyles from "../styles/journalStyles";
import MorphingImage from "./MorphingImage";

// 1) your static descriptions & tips
const emotionInfo = {
  happiness: {
    description: "Happiness is a feeling of joy, satisfaction, and well-being.",
    advice: "Take a moment to savor what’s going well right now.",
  },
  gratitude: {
    description: "Gratitude is appreciation for people, things, or moments in your life.",
    advice: "Write down three things you’re grateful for today.",
  },
  "self-confidence": {
    description: "Self-confidence is trusting in your own abilities and worth.",
    advice: "Recall a recent win, no matter how small, to boost your belief.",
  },
  relaxation: {
    description: "Relaxation is the state of being free from tension and stress.",
    advice: "Try a deep-breathing exercise for two minutes.",
  },
  motivation: {
    description: "Motivation is the drive that pushes you toward goals.",
    advice: "Set one small, clear goal and take the first step now.",
  },
  sadness: {
    description: "Sadness is a natural response to loss or disappointment.",
    advice: "Allow yourself to feel, then reach out to someone you trust.",
  },
  guilt: {
    description: "Guilt arises when we feel responsible for a harm done.",
    advice: "Acknowledge it, learn what you can, and consider making amends.",
  },
  frustration: {
    description: "Frustration comes from obstacles blocking your goals.",
    advice: "Take a short break and return with a fresh perspective.",
  },
  anxiety: {
    description: "Anxiety is worry about future uncertainties.",
    advice: "Ground yourself: notice 5 things you can see, 4 you can touch.",
  },
  anger: {
    description: "Anger is a strong feeling of displeasure or hostility.",
    advice: "Pause and take three deep breaths before reacting.",
  },
};

export default function EmotionSelector({
  emotions = [],
  selectedEmotionId,
  onSelectEmotion,
}) {
  // 2) desired sort order
  const order = [
    "happiness",
    "gratitude",
    "self-confidence",
    "relaxation",
    "motivation",
    "sadness",
    "guilt",
    "frustration",
    "anxiety",
    "anger",
  ];

  // 3) sort the incoming list
  const sortedEmotions = useMemo(() => {
    return [...emotions].sort((a, b) => {
      const ai = order.indexOf(a.name.toLowerCase());
      const bi = order.indexOf(b.name.toLowerCase());
      const aIndex = ai === -1 ? order.length : ai;
      const bIndex = bi === -1 ? order.length : bi;
      return aIndex - bIndex;
    });
  }, [emotions]);

  // carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trigger, setTrigger] = useState(0);

  // modal state
  const [modalVisible, setModalVisible] = useState(false);

  // 4) init selection
  useEffect(() => {
    if (!sortedEmotions.length) return;
    const start = selectedEmotionId
      ? sortedEmotions.findIndex((e) => e.id === selectedEmotionId)
      : 0;
    const safe = start >= 0 ? start : 0;
    setCurrentIndex(safe);
    onSelectEmotion(sortedEmotions[safe].id);
  }, [sortedEmotions, selectedEmotionId]);

  const handleChange = (dir) => {
    if (!sortedEmotions.length) return;
    const next =
      dir === "next"
        ? (currentIndex + 1) % sortedEmotions.length
        : (currentIndex - 1 + sortedEmotions.length) %
          sortedEmotions.length;
    setCurrentIndex(next);
    onSelectEmotion(sortedEmotions[next].id);
    setTrigger((t) => t + 1);
  };

  if (!sortedEmotions.length) return null;

  const prev = sortedEmotions[
    (currentIndex - 1 + sortedEmotions.length) % sortedEmotions.length
  ];
  const curr = sortedEmotions[currentIndex];
  const info = emotionInfo[curr.name.toLowerCase()] || {};

  return (
    <>
      {/* Carousel */}
      <View style={JournalStyles.carouselContainer}>
        <Text style={JournalStyles.subtitle}>What do you feel?</Text>
        <View style={JournalStyles.carouselContent}>
          <TouchableOpacity onPress={() => handleChange("prev")}>
            <Ionicons name="chevron-back" size={32} color="#fff" />
          </TouchableOpacity>

          <View style={JournalStyles.emotionCard}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setModalVisible(true)}
            >
              <MorphingImage
                fromUri={prev.imagePath}
                toUri={curr.imagePath}
                trigger={trigger}
                size={180}
                duration={800}
              />
            </TouchableOpacity>
            <Text style={JournalStyles.emotionText}>{curr.name}</Text>
          </View>

          <TouchableOpacity onPress={() => handleChange("next")}>
            <Ionicons name="chevron-forward" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Info Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={JournalStyles.modalOverlay}>
          <View style={JournalStyles.modalContent}>
            <Text style={JournalStyles.modalTitle}>{curr.name}</Text>
            <Text style={JournalStyles.modalDescription}>{info.description}</Text>
            <Text style={JournalStyles.modalAdvice}>{info.advice}</Text>
            <TouchableOpacity
              style={JournalStyles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={JournalStyles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
