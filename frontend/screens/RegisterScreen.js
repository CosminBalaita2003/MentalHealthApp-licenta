import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView,
  ScrollView, TouchableWithoutFeedback, Keyboard, Platform,
  FlatList, Modal, Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import userService from '../services/userService';
import styles from '../styles/authStyles';
import theme from '../styles/theme';

const RegisterScreen = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    dateOfBirth: new Date(),
    timeOfBirth: new Date(new Date().setHours(12, 0, 0)),
    cityId: '',
    city: '',
    pronouns: '',
    gender: '',
    bio: '',
  });

  const [knowsBirthTime, setKnowsBirthTime] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState([]);
  const [showCityList, setShowCityList] = useState(false);

  const navigation = useNavigation();

  // Validări real-time
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const passLength = formData.password.length >= 6;
  const passSpecial = /[^a-zA-Z0-9]/.test(formData.password);
  const passUpper = /[A-Z]/.test(formData.password);

  const getColor = (isValid, hasValue) => {
    if (!hasValue) return '#999'; // gri
    return isValid ? 'lightgreen' : 'red';
  };

  const handleNext = () => {
    if (formData.fullName && emailValid && passLength && passSpecial && passUpper)  {
      setStep(2);
    } else {
      Alert.alert("Error", "Please complete all required fields correctly.");
    }
  };

  const handleRegister = async () => {
    const today = new Date();
    if (formData.dateOfBirth > today) {
      Alert.alert("Invalid Date", "Birth date cannot be in the future.");
      return;
    }

    if (!formData.cityId || !formData.gender || !formData.pronouns || !formData.bio) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const formattedTime = knowsBirthTime
      ? formData.timeOfBirth.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      : null;

    try {
      const response = await userService.register({
        ...formData,
        dateOfBirth: formData.dateOfBirth.toISOString(),
        timeOfBirth: formattedTime,
      });

      if (response.success) {
        Alert.alert("Success", "User registered successfully!", [
          { text: "OK", onPress: () => navigation.replace("WelcomeScreen") },
        ]);
      } else {
        const errorMsg = response.errors?.[0] || response.message || "Registration failed.";
        Alert.alert("Registration Error", errorMsg);
      }
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };
  const searchCities = async (text) => {
    setSearchTerm(text);

    if (text.length < 2) {
      setCities([]);
      setShowCityList(false);
      return;
    }

    try {
      console.log("🔍 Searching for cities:", text);
      const response = await fetch(`${process.env.API_URL}/api/City/search?name=${text}`);

      if (!response.ok) {
        const textRes = await response.text();
        console.error("❌ Bad response:", response.status, textRes);
        throw new Error(`Invalid API response: ${response.status}`);
      }

      const data = await response.json();
      const citiesArray = data?.$values || data;

      if (Array.isArray(citiesArray) && citiesArray.length > 0) {
        setCities(citiesArray);
        setShowCityList(true);
        console.log("✅ Cities found:", citiesArray);
      } else {
        setCities([]);
        setShowCityList(true); // still show message
        console.log("⚠️ No cities found.");
      }
    } catch (error) {
      console.error("🚨 Error fetching cities:", error);
      setCities([]);
      setShowCityList(false);
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Register</Text>

          {step === 1 ? (
            <>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#fff"  
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#fff"  

                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />
              <Text style={{ color: getColor(emailValid, formData.email) }}>
                {formData.email === ''
                  ? 'Required format: name@example.com'
                  : emailValid
                  ? '✓ Valid email'
                  : '✗ Invalid email format'}
              </Text>

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#fff"  
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
              />
              <Text style={{ color: getColor(passLength, formData.password) }}>
                {formData.password === ''
                  ? 'At least 6 characters'
                  : passLength
                  ? 'At least 6 characters'
                  : 'Too short'}
              </Text>
              <Text style={{ color: getColor(passSpecial, formData.password) }}>
                {formData.password === ''
                  ? 'Includes a special character'
                  : passSpecial
                  ? 'Includes a special character'
                  : 'Missing special character'}
              </Text>

              <Text style={{ color: getColor(passUpper, formData.password) }}>
                {formData.password === ''
                  ? 'Includes an uppercase letter'
                  : passUpper
                  ? 'Includes an uppercase letter'
                  : 'Missing uppercase letter'}
              </Text>

              <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Date of Birth */}
              <Text style={styles.text}>Date of Birth</Text>
              <TouchableOpacity style={styles.time} onPress={() => setShowDatePicker(true)}>
                <Text style={{olor:theme.colors.background}}>{formData.dateOfBirth.toDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <>
                  <DateTimePicker
                    value={formData.dateOfBirth}
                    mode="date"
                    display="spinner"
                    textColor="white"
                    onChange={(event, selectedDate) => {
                      const today = new Date();
                      if (selectedDate && selectedDate > today) {
                        Alert.alert("Invalid Date", "Date cannot be in the future.");
                        return;
                      }
                      setFormData({ ...formData, dateOfBirth: selectedDate || formData.dateOfBirth });
                    }}
                  />
                  <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.buttonText}>Save Date</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Time of Birth */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <TouchableOpacity
                    onPress={() => setKnowsBirthTime(!knowsBirthTime)}
                    style={{
                      width: 20,
                      height: 20,
                      borderWidth: 1,
                      borderColor: theme.colors.text,
                      backgroundColor: knowsBirthTime ? theme.colors.text : 'transparent',
                      marginRight: 10,
                      borderRadius: 5,
                    }}
                  
                />
                <Text style={styles.label}>Do you know your birth time?</Text>
              </View>

              {knowsBirthTime && (
                <>
                  <Text style={styles.label}>Birth Hour</Text>
                  <TouchableOpacity style={styles.time} onPress={() => setShowTimePicker(true)}>
                    <Text style={styles.timeText}>
                      {formData.timeOfBirth.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <>
                      <DateTimePicker
                        value={formData.timeOfBirth}
                        mode="time"
                        display="spinner"
                        textColor="white"
                        onChange={(event, selectedTime) =>
                          setFormData({ ...formData, timeOfBirth: selectedTime || formData.timeOfBirth })
                        }
                      />
                      <TouchableOpacity style={styles.button} onPress={() => setShowTimePicker(false)}>
                        <Text style={styles.buttonText}>Save Time</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}

             {/* City */}
             <Text style={styles.text}>City</Text>
              <TouchableOpacity style={styles.inputContainer} onPress={() => setShowCityModal(true)}>
                <Text style={[styles.input, { paddingVertical: 15 }]}>
                  {formData.city || "Select City"}
                </Text>
              </TouchableOpacity>

              {/* City Modal */}
              <Modal visible={showCityModal} animationType="slide" transparent>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.title}>Search City</Text>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Type city name..."
                        placeholderTextColor={theme.colors.black}
                        value={searchTerm}
                        onChangeText={(text) => {
                          setSearchTerm(text);
                          searchCities(text);
                        }}
                        autoFocus
                      />
                      {showCityList && (
                        cities.length > 0 ? (
                          <FlatList
                            data={cities}
                            keyExtractor={(item) => item.id.toString()}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                style={styles.cityListItem}
                                onPress={() => {
                                  setFormData({ ...formData, cityId: item.id, city: item.name });
                                  setShowCityModal(false);
                                  Keyboard.dismiss();
                                }}
                              >
                                <Text style={styles.cityListItemText}>
                                  {item.name}, {item.country}
                                </Text>
                              </TouchableOpacity>
                            )}
                          />
                        ) : (
                          <Text style={{ color: "#999", textAlign: "center", marginTop: 12 }}>
                            No cities found.
                          </Text>
                        )
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
              {/* Pronouns */}
              <Text style={styles.label}>Pronouns</Text>
              <TextInput
                style={styles.input}
                placeholder="Pronouns"
                value={formData.pronouns}
                onChangeText={(text) => setFormData({ ...formData, pronouns: text })}
              />

              {/* Gender */}
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={styles.input}
                placeholder="Gender"
                value={formData.gender}
                onChangeText={(text) => setFormData({ ...formData, gender: text })}
              />

              {/* Bio */}
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Bio"
                value={formData.bio}
                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                multiline
              />

              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;
