import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import userService from '../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/globalStyles';
import { AuthContext } from '../App';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);

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

        console.log("Fetching user profile...");
        const result = await userService.getUser();

        if (result.success) {
          setUser(result.user);
        } else {
          setError(true);
          Alert.alert('Eroare', result.message);
        }
      } catch (error) {
        setError(true);
        console.error("Eroare la obținerea profilului:", error.message);
        Alert.alert('Eroare', 'Nu s-a putut încărca profilul.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      console.log("🚀 Logging out...");

      // 🔥 Șterge toate datele din AsyncStorage
      await AsyncStorage.clear();
      console.log(" AsyncStorage cleared!");

      // 🔥 Setează `isAuthenticated` la false
      setIsAuthenticated(false);

      console.log(" User logged out, App.js will re-render.");
    } catch (error) {
      console.error(" Error during logout:", error);
    }
  };

  return (
    <View style={globalStyles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#E8BCB9" />
      ) : error ? (
        <>
          <Text style={globalStyles.text}>Unable to load data...</Text>
          <TouchableOpacity style={globalStyles.button} onPress={() => navigation.replace('ProfileScreen')}>
            <Text style={globalStyles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </>
      ) : (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
          <Text style={globalStyles.title}>Welcome</Text>

          <Text style={globalStyles.text}>Email: {user.email || "unknown"}</Text>
          <Text style={globalStyles.text}>Name: {user.fullName || "unknown"}</Text>
          <Text style={globalStyles.text}>Birthday: {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "unknown"}</Text>
          <Text style={globalStyles.text}>BirthTime: {user.timeOfBirth || "unknown"}</Text>
          <Text style={globalStyles.text}>City: {user.cityName || "unknown"}</Text>
          <Text style={globalStyles.text}>Gender: {user.gender || "unknown"}</Text>
          <Text style={globalStyles.text}>Pronouns: {user.pronouns || "unknown"}</Text>
          <Text style={globalStyles.text}>Bio: {user.bio || "unknown unknown"}</Text>

          <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={globalStyles.buttonText}>Edit your profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[globalStyles.button, globalStyles.logoutButton]} onPress={handleLogout}>
            <Text style={globalStyles.buttonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={globalStyles.button} onPress={() => navigation.getParent()?.navigate('AstroChartScreen', { user })}>
            <Text style={globalStyles.buttonText}>View Astro Chart</Text>
          </TouchableOpacity>

        </ScrollView>
      )}
    </View>
  );
}
