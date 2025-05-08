import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../App';
import userService from '../services/userService';
import styles from '../styles/profileStyles';
import StreakIndicator from '../components/StreakIndicator';
import ExerciseProgressSummary from "../components/ProgressSummary";
import BreathingContainer from '../components/BreathingContainer';
import { getPersonalizedDailyTips } from '../utils/getDailyTips';
import { fetchEmotionInsightVectors } from "../services/insightService"; // ajustează calea dacă e nevoie
import { getUserTestSummaries } from "../services/testService";
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);
  const [tips, setTips] = useState([]);
  const [emotionInsight, setEmotionInsight] = useState(null);
  const [testSummary, setTestSummary] = useState(null);

  useEffect(() => {
    const loadEverything = async () => {
      try {
        setLoading(true);
  
        const [emotion, testSummary, tipsList] = await Promise.all([
          fetchEmotionInsightVectors(),
          getUserTestSummaries(),
          getPersonalizedDailyTips(), // acest apel include deja toate celelalte
        ]);
  
        if (testSummary.success) {
          setEmotionInsight(emotion);
          setTestSummary(testSummary.summaries);
          setTips(tipsList);
        } else {
          setTips(["Take a deep breath. You're doing your best – and that’s more than enough."]);
        }
      } catch (e) {
        console.error("❌ Failed to load tips or summaries:", e);
        setTips(["Something went wrong. You're still doing great."]);
      } finally {
        setLoading(false);
      }
    };
  
    loadEverything();
  }, []);
  
  useFocusEffect(
    React.useCallback(() => {
      const refreshTips = async () => {
        const newTips = await getPersonalizedDailyTips();
        setTips(newTips);
      };
  
      refreshTips();
    }, [])
  );
  
  useEffect(() => {

    
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(false);

        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Sesiune expirată', 'Te rugăm să te autentifici din nou.');
          navigation.replace('WelcomeScreen');
          return;
        }

        const result = await userService.getUser();
        if (result.success) {
          setUser(result.user);
        } else {
          setError(true);
          Alert.alert('Eroare', result.message);
        }
      } catch (error) {
        setError(true);
        Alert.alert('Eroare', 'Nu s-a putut încărca profilul.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#E8BCB9" style={styles.loader} />;
  }

  if (error || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Unable to load data...</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('ProfileScreen')}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
  

  return (
    <View style={{ flex: 1, backgroundColor: "#16132D" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome, {user.fullName?.split(" ")[0] || "User"}!</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={styles.iconButton}>
              <Ionicons name="create-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <StreakIndicator />
       


        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.getParent()?.navigate('AstroChartScreen', { user })}
        >
          <Ionicons name="planet-outline" size={22} color="#5A4E4D" />
          <Text style={styles.cardText}>View Astro Chart</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.card}
  onPress={() => navigation.getParent()?.navigate("ProgressScreen")}
>
  <Ionicons name="bar-chart-outline" size={22} color="#5A4E4D" />
  <Text style={styles.cardText}>View your Progress</Text>
</TouchableOpacity>
<BreathingContainer>
  <Text style={styles.tipsTitle}>Daily Tips</Text>
  {tips.map((tip, index) => (
    <Text key={index} style={styles.tipText}>{tip}</Text>
  ))}
</BreathingContainer>




      </ScrollView>
    </View>

  );
}
