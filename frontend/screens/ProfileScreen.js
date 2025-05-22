import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../App';
import userService from '../services/userService';
import styles from '../styles/profileStyles';
import StreakIndicator from '../components/StreakIndicator';
import BreathingContainer from '../components/BreathingContainer';
import { getPersonalizedDailyTips } from '../utils/getDailyTips';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingTips, setLoadingTips] = useState(true);
  const [error, setError] = useState(false);
  const [tips, setTips] = useState([]);
  const { setIsAuthenticated } = useContext(AuthContext);

  // 1) Încarcă profilul o singură dată la mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoadingProfile(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Sesiune expirată', 'Te rugăm să te autentifici din nou.');
          return navigation.replace('WelcomeScreen');
        }
        const result = await userService.getUser();
        if (result.success) {
          setUser(result.user);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(true);
        Alert.alert('Eroare', err.message || 'Nu s-a putut încărca profilul.');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchUserProfile();
  }, []);

  // 2) La fiecare focus pe screen, regenerează Daily Tips
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const loadTips = async () => {
        setLoadingTips(true);
        try {
          const newTips = await getPersonalizedDailyTips();
          if (isActive) {
            setTips(
              Array.isArray(newTips) && newTips.length
                ? newTips
                : ["Take a deep breath. You're doing your best – and that’s more than enough."]
            );
          }
        } catch {
          if (isActive) {
            setTips(["Something went wrong. You're still doing great."]);
          }
        } finally {
          if (isActive) setLoadingTips(false);
        }
      };
      loadTips();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setIsAuthenticated(false);
  };

  if (loadingProfile) {
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
          <Text style={styles.title}>Welcome, {user.fullName.split(" ")[0]}!</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.iconButton}
            >
              <Ionicons name="create-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <StreakIndicator />

        {/* <TouchableOpacity
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
        </TouchableOpacity> */}

 <View style={styles.buttonRow}>
  <TouchableOpacity
    style={styles.squareCard}
    onPress={() => navigation.getParent()?.navigate('AstroChartScreen', { user })}
  >
    <Ionicons name="planet-outline" size={28} color="#5A4E4D" />
    <Text style={styles.squareCardText}>Astro Chart</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.squareCard}
    onPress={() => navigation.getParent()?.navigate("ProgressScreen")}
  >
    <Ionicons name="bar-chart-outline" size={28} color="#5A4E4D" />
    <Text style={styles.squareCardText}>Progress</Text>
  </TouchableOpacity>
</View>


        <BreathingContainer>
          <Text style={styles.tipsTitle}>Daily Tips</Text>
          {loadingTips ? (
            <ActivityIndicator />
          ) : (
            tips.map((tip, idx) => (
              <Text key={idx} style={styles.tipText}>
                {tip}
              </Text>
            ))
          )}
        </BreathingContainer>
      </ScrollView>
    </View>
  );
}
