import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import userService from '../services/userService'; // Schimbare profileService -> userService
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/globalStyles';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Eroare', 'Sesiunea a expirat. Te rugăm să te autentifici din nou.');
          navigation.replace('Login');
          return;
        }

        console.log("Fetching user profile...");
        const result = await userService.getUser();
        
        if (result.success) {
          setUser(result.user);
        } else {
          Alert.alert('Eroare', result.message);
          navigation.replace('Login');
        }
      } catch (error) {
        console.error("Eroare la obținerea profilului:", error.message);
        Alert.alert('Eroare', 'Nu s-a putut încărca profilul.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    await userService.logout();
    navigation.replace('Login');
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Bine ai venit!</Text>

      {loading ? (
        <Text style={globalStyles.text}>Se încarcă...</Text>
      ) : user ? (
        <>
          <Text style={globalStyles.text}>Email: {user.email || "Necunoscut"}</Text>
          <Text style={globalStyles.text}>Nume: {user.fullName || "Necunoscut"}</Text>
          <Text style={globalStyles.text}>Data nașterii: {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Necunoscut"}</Text>
          <Text style={globalStyles.text}>Ora nașterii: {user.timeOfBirth || "Necunoscut"}</Text>
          <Text style={globalStyles.text}>Oraș: {user.cityName || "Necunoscut"}</Text>
          <Text style={globalStyles.text}>Gen: {user.gender || "Necunoscut"}</Text>
          <Text style={globalStyles.text}>Pronume: {user.pronouns || "Necunoscut"}</Text>
          <Text style={globalStyles.text}>Bio: {user.bio || "Fără biografie"}</Text>

          <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate('EditProfileScreen')}>
            <Text style={globalStyles.buttonText}>Editează Profil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.button} onPress={handleLogout}>
            <Text style={globalStyles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={globalStyles.text}>Nu s-au putut încărca datele utilizatorului.</Text>
          <TouchableOpacity style={globalStyles.button} onPress={() => navigation.replace('HomeScreen')}>
            <Text style={globalStyles.buttonText}>Reîncearcă</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
