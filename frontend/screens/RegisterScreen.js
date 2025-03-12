import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, FlatList, Keyboard, 
  TouchableWithoutFeedback, StyleSheet, ScrollView 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../styles/globalStyles';

const RegisterScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [timeOfBirth, setTimeOfBirth] = useState(new Date());
  const [cityId, setCityId] = useState('');
  const [cityName, setCityName] = useState('');
  const [gender, setGender] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [bio, setBio] = useState('');

  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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

  const handleRegister = async () => {
    if (!fullName || !email || !password || !cityId || !gender || !pronouns || !bio) {
      Alert.alert("Eroare", "Toate câmpurile sunt obligatorii.");
      return;
    }

    const formattedTime = timeOfBirth.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    const result = await authService.register(fullName, email, password, dateOfBirth.toISOString(), formattedTime, cityId, gender, pronouns, bio);
    Alert.alert(result.success ? "Succes" : "Eroare", result.message);

    if (result.success) {
      navigation.replace('Login');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.innerContainer}>
          <Text style={GlobalStyles.title}>Creare cont</Text>

          <Text style={GlobalStyles.text}>Nume complet</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Nume complet"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={GlobalStyles.text}>Email</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={GlobalStyles.text}>Parola</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Parola"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={GlobalStyles.text}>Data nașterii</Text>
          <TouchableOpacity style={GlobalStyles.input} onPress={() => setShowDatePicker(true)}>
            <Text>{dateOfBirth.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                setDateOfBirth(selectedDate || dateOfBirth);
              }}
            />
          )}

          <Text style={GlobalStyles.text}>Ora nașterii</Text>
          <TouchableOpacity style={GlobalStyles.input} onPress={() => setShowTimePicker(true)}>
            <Text>{timeOfBirth.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={timeOfBirth}
              mode="time"
              display="spinner"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                setTimeOfBirth(selectedTime || timeOfBirth);
              }}
            />
          )}

          <Text style={GlobalStyles.text}>Oraș</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Caută oraș..."
            value={searchTerm}
            onChangeText={(text) => {
              setSearchTerm(text);
              searchCities(text);
            }}
          />

          {cities.length > 0 && (
            <FlatList
              data={cities}
              keyExtractor={(item) => item.id.toString()}
              style={styles.cityList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cityCard}
                  onPress={() => {
                    setCityId(item.id);
                    setCityName(item.name);
                    setSearchTerm(`${item.name}, ${item.country}`);
                    setCities([]);
                    Keyboard.dismiss();
                  }}
                >
                  <Text style={styles.cityName}>{item.name}</Text>
                  <Text style={styles.cityCountry}>{item.country}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <Text style={GlobalStyles.text}>Gen</Text>
          <TextInput style={GlobalStyles.input} placeholder="Gen" value={gender} onChangeText={setGender} />

          <Text style={GlobalStyles.text}>Pronume</Text>
          <TextInput style={GlobalStyles.input} placeholder="Pronume" value={pronouns} onChangeText={setPronouns} />

          <Text style={GlobalStyles.text}>Bio</Text>
          <TextInput style={GlobalStyles.input} placeholder="Scrie ceva despre tine" value={bio} onChangeText={setBio} multiline />

          <TouchableOpacity style={GlobalStyles.button} onPress={handleRegister}>
            <Text style={GlobalStyles.buttonText}>Înregistrează-te</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={GlobalStyles.text}>Ai deja un cont? Autentifică-te!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  cityList: { maxHeight: 200, width: '100%', borderRadius: 8, backgroundColor: 'white' },
  cityCard: { padding: 12, borderBottomWidth: 1, borderColor: '#ddd' },
  cityName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cityCountry: { fontSize: 14, color: '#666' },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: '100%',
    padding: 20,
  },
});

export default RegisterScreen;
