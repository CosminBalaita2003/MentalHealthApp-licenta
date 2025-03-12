import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, FlatList, Keyboard, 
  TouchableWithoutFeedback, StyleSheet, KeyboardAvoidingView, Platform 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import userService from '../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../styles/globalStyles';
import ttheme from '../styles/theme';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    dateOfBirth: new Date(),
    timeOfBirth: new Date(new Date().setHours(12, 0, 0)), // 🔹 Setare implicită 12:00:00
    cityId: '',
    bio: '',
    gender: '',
    pronouns: '',
  });

  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching user profile...");
        const userResponse = await userService.getUser();

        if (userResponse.success) {
          setProfile({
            fullName: userResponse.user.fullName || '',
            dateOfBirth: userResponse.user.dateOfBirth 
              ? new Date(userResponse.user.dateOfBirth) 
              : new Date(),
            timeOfBirth: userResponse.user.timeOfBirth 
              ? new Date(`1970-01-01T${userResponse.user.timeOfBirth}`)
              : new Date(new Date().setHours(12, 0, 0)), // 🔹 Fix pentru ora invalidă
            cityId: userResponse.user.cityId || '',
            bio: userResponse.user.bio || '',
            gender: userResponse.user.gender || '',
            pronouns: userResponse.user.pronouns || '',
          });
        } else {
          Alert.alert("Eroare", userResponse.message);
        }
      } catch (error) {
        console.error("Eroare la obținerea profilului:", error.message);
        Alert.alert("Eroare", "Nu s-au putut obține datele utilizatorului.");
      }
    };

    fetchProfile();
  }, []);

  const searchCities = async (text) => {
    setSearchTerm(text);
    if (text.length < 2) {
      setCities([]);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${process.env.API_URL}/api/City/search?name=${text}`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setCities(data);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error("Eroare la căutarea orașelor:", error.message);
      setCities([]);
    }
  };

  const handleSave = async () => {
    if (!profile.fullName || !profile.cityId || !profile.gender || !profile.pronouns || !profile.bio) {
      Alert.alert("Eroare", "Toate câmpurile sunt obligatorii.");
      return;
    }

    const formattedTime = profile.timeOfBirth instanceof Date
      ? profile.timeOfBirth.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      : "12:00:00"; // 🔹 Fix pentru `undefined`

    const profileData = { 
      ...profile, 
      dateOfBirth: profile.dateOfBirth.toISOString(),
      timeOfBirth: formattedTime,
      city: {
        id: profile.cityId,
        name: profile.cityName,
        country: profile.country,
      },
    };

    console.log("🔹 Payload trimis la backend:", JSON.stringify(profileData, null, 2));

    const result = await userService.editUser(profileData);

    if (result.success) {
      Alert.alert("Succes", result.message);
      navigation.replace("HomeScreen");
    } else {
      Alert.alert("Eroare", "Actualizarea a eșuat: " + result.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <Text style={GlobalStyles.title}>Edit Profile</Text>
          <Text style={GlobalStyles.text}>Full Name</Text>
          <TextInput style={GlobalStyles.input} placeholder='Full Name' value={profile.fullName} onChangeText={(text) => setProfile({ ...profile, fullName: text })} />

         {/* Date of Birth */}
<Text style={GlobalStyles.text}>Date of Birth</Text>
<TouchableOpacity style={GlobalStyles.time} onPress={() => setShowDatePicker(true)}>
  <Text>{profile.dateOfBirth.toDateString()}</Text>
</TouchableOpacity>

{showDatePicker && (
  <View>
    <DateTimePicker 
      value={profile.dateOfBirth} 
      mode="date" 
      display="spinner" 
      onChange={(event, selectedDate) => setProfile({ ...profile, dateOfBirth: selectedDate || profile.dateOfBirth })}
    />
    <TouchableOpacity style={[GlobalStyles.button, { marginBottom: 20 }]} onPress={() => setShowDatePicker(false)}>
      <Text style={GlobalStyles.buttonText}>Save Date</Text>
    </TouchableOpacity>
  </View>
)}


{/* Time of Birth */}
<Text style={GlobalStyles.text}>Time of Birth</Text>
<TouchableOpacity style={GlobalStyles.time} onPress={() => setShowTimePicker(true)}>
  <Text >{profile.timeOfBirth.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
</TouchableOpacity>

{showTimePicker && (
  <View>
    <DateTimePicker 
      value={profile.timeOfBirth} 
      mode="time" 
      display="spinner" 
      onChange={(event, selectedTime) => setProfile({ ...profile, timeOfBirth: selectedTime || profile.timeOfBirth })}
    />
    <TouchableOpacity style={[GlobalStyles.button, { marginBottom: 20 }]} onPress={() => setShowTimePicker(false)}>
      <Text style={GlobalStyles.buttonText}>Save Time</Text>
    </TouchableOpacity>
  </View>
)}

{/* City Search */}
          <Text style={GlobalStyles.text}>City</Text>
          <TextInput style={GlobalStyles.input} placeholder="Search city..." value={searchTerm} onChangeText={(text) => { setSearchTerm(text); searchCities(text); }} />

          {cities.length > 0 && (
            <FlatList
              data={cities}
              keyExtractor={(item) => item.id.toString()}
              style={styles.cityList}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.cityCard} onPress={() => { setProfile({ ...profile, cityId: item.id, cityName: item.name, country: item.country }); setSearchTerm(`${item.name}, ${item.country}`); setCities([]); Keyboard.dismiss(); }}>
                  <Text style={styles.cityName}>{item.name}</Text>
                  <Text style={styles.cityCountry}>{item.country}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <Text style={GlobalStyles.text}>Gender</Text>
          <TextInput style={GlobalStyles.input} placeholder='Gender' value={profile.gender} onChangeText={(text) => setProfile({ ...profile, gender: text })} />
          <Text style={GlobalStyles.text}>Pronouns</Text>
          <TextInput style={GlobalStyles.input} placeholder='Pronouns' value={profile.pronouns} onChangeText={(text) => setProfile({ ...profile, pronouns: text })} />
          <Text style={GlobalStyles.text}>Bio</Text>
          <TextInput style={GlobalStyles.input} placeholder='Bio' value={profile.bio} onChangeText={(text) => setProfile({ ...profile, bio: text })} />
          <TouchableOpacity style={GlobalStyles.button} onPress={handleSave}>
            <Text style={GlobalStyles.buttonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({ container: { flex: 1 }, innerContainer: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor:"#A8E6CF" }, cityList: { maxHeight: 200, width: '100%', borderRadius: 8, backgroundColor: 'white' }, cityCard: { padding: 12, borderBottomWidth: 1, borderColor: '#ddd' }, cityName: { fontSize: 16, fontWeight: 'bold', color: '#333' }, cityCountry: { fontSize: 14, color: '#666' } });

export default EditProfileScreen;
