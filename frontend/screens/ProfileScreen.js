import React, { useEffect, useState, useContext, useCallback, useRef  } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
    KeyboardAvoidingView,
  Platform,
  Modal, Linking, Animated, pulseAnim
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
import testService from '../services/testService';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingTips, setLoadingTips] = useState(true);
  const [error, setError] = useState(false);
  const [tips, setTips] = useState([]);
  const { setIsAuthenticated } = useContext(AuthContext);
  const [supportVisible, setSupportVisible] = useState(false);
  const [hasHighDepression, setHasHighDepression] = useState(false);

 


const checkDepressionLevel = async () => {
  try {
    const { success, summaries } = await testService.getUserTestSummaries();
    if (!success) return;

    const phq = summaries["PHQ-9"];
    if (!phq) return;

    const { latestScore, averageScore, latestInterpretation } = phq;

    if (latestScore >= 15 || averageScore >= 15) {
      setHasHighDepression(true);
      const pulseAnim = useRef(new Animated.Value(1)).current;

      console.log(" High depression detected:", latestInterpretation);
    }
  } catch (err) {
    console.log("Error checking depression summary:", err);
  }
};

  const handleCallSupport = () => {
  setSupportVisible(false);
  Linking.openURL('tel:0800 801 200'); // număr generic pentru linia verde
};

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

  const pulseAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {
  if (hasHighDepression) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }
}, [hasHighDepression]);


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

useFocusEffect(
  useCallback(() => {
    checkDepressionLevel();
  }, [user])
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
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        <View style={styles.header}>
          <Text style={styles.title}>Welcome, {user.fullName.split(" ")[0]}!</Text>
          <View style={styles.actions}>
          <Animated.View style={{ transform: [{ scale: hasHighDepression ? pulseAnim : 1 }] }}>
  <TouchableOpacity onPress={() => setSupportVisible(true)} style={styles.iconButton}>
    <Ionicons name="help-buoy-outline" size={24} color="#fff" />
  </TouchableOpacity>
</Animated.View>




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
      </KeyboardAvoidingView>

<Modal
  transparent
  visible={supportVisible}
  animationType="fade"
  onRequestClose={() => setSupportVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>You are not alone.</Text>
      <Text style={styles.modalText}>
  You can call the emotional support line whenever you need to talk. We're here for you.
</Text>

{hasHighDepression && (
  <Text style={styles.alertText}>
    Based on your recent results, we noticed signs of moderate to severe depression.
    You’re not alone - please don’t hesitate to reach out.

  </Text>
)}

      <TouchableOpacity
  style={[
    styles.modalButton,
    hasHighDepression && { backgroundColor: '#E63946' } // roșu dacă depresia e mare
  ]}
  onPress={handleCallSupport}
>
  <Text style={styles.modalButtonText}>Call Support</Text>
</TouchableOpacity>

      <TouchableOpacity onPress={() => setSupportVisible(false)}>
        <Text style={styles.modalCancelText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>




    </View>
  );
}
