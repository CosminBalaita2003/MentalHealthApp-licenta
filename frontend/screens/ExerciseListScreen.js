import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/exerciseScreenStyles";
import ExerciseModal from "../components/ExerciseModal";
import theme from "../styles/theme";

const categoryDescriptions = {
  "Breathing": "Breathing exercises involve slow, controlled inhalation and exhalation patterns that influence the autonomic nervous system. Research shows that consistent breath regulation enhances vagal tone, reduces sympathetic overactivity, and helps maintain psychological balance. This technique fosters resilience to stress, lowers blood pressure, and contributes to emotional regulation.",

  "Meditation & Mindfulness": "Meditation and mindfulness are mental practices that develop awareness and attentional control. Functional MRI studies reveal that these practices modulate brain activity in regions associated with emotion regulation, such as the amygdala and prefrontal cortex. They are effective in reducing emotional reactivity, improving cognitive performance, and promoting long-term psychological well-being.",

  "Progressive Muscle Relaxation": "Progressive Muscle Relaxation is a therapeutic method that alternates between tensing and relaxing specific muscle groups. It enhances somatic awareness and disrupts the stress response by lowering physiological arousal. Clinical studies report improvements in sleep quality, reductions in anxiety, and better management of chronic physical discomfort among regular practitioners.",

  "Emotional Regulation Exercises": "These exercises are designed to enhance adaptive emotional processing and expression. They include techniques like reappraisal, acceptance, and behavioral strategies to shift maladaptive patterns. Neuroscientific findings indicate their role in balancing affective states and increasing psychological flexibility, thereby reducing symptoms of anxiety, depression, and interpersonal distress.",

  "Visualization Techniques": "Visualization techniques involve the mental simulation of scenarios that elicit calming or empowering responses. Neuroimaging research shows activation of motor and emotional brain regions during visualization, indicating that imagined experiences can influence real-world psychological and physiological states. This method is commonly used to reduce anticipatory anxiety and improve focus and mood regulation.",


  "Stress Management Techniques": "Stress management encompasses structured approaches to cope with emotional and physiological responses to challenges. These methods often integrate physical activity, relaxation training, and cognitive restructuring. Evidence supports their effectiveness in reducing cortisol levels, enhancing coping mechanisms, and preventing the escalation of chronic stress into long-term mental health issues."
};



const ExerciseListScreen = ({ route }) => {
  const { categoryId, exercises, categoryName } = route.params;
  const [selectedExercise, setSelectedExercise] = useState(null);
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { marginTop: 0, marginLeft: 10, flexShrink: 1 }]}>
            {categoryName}
          </Text>
        </View>

        <Text style={[styles.description, { marginBottom: 20, fontStyle: "italic" }]}>
          {categoryDescriptions[categoryName] || "No description available."}
        </Text>

        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.card}
            onPress={() => setSelectedExercise(exercise)}
          >
            <Text style={styles.cardText}>{exercise.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedExercise && (
        <ExerciseModal
          visible={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          exercise={selectedExercise}
        />
      )}
    </View>
  );
};

export default ExerciseListScreen;
