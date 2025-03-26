import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView,
  ScrollView, TouchableWithoutFeedback, Keyboard, Platform,
  FlatList, Modal, Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import userService from '../services/userService';
import styles from '../styles/registerStyle';
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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [knowsBirthTime, setKnowsBirthTime] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState([]);
  const [showCityList, setShowCityList] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const validateStepOne = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format.";

    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    else if (!/[^a-zA-Z0-9]/.test(formData.password))
      newErrors.password = "Must include a special character.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const searchCities = async (text) => {
    setSearchTerm(text);
    if (text.length < 2) {
      setCities([]);
      setShowCityList(false);
      return;
    }
    try {
      const response = await fetch(`${process.env.API_URL}/api/City/search?name=${text}`);
      const data = await response.json();
      const citiesArray = data?.$values || data;
      if (Array.isArray(citiesArray)) {
        setCities(citiesArray);
        setShowCityList(true);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
      setShowCityList(false);
    }
  };

  const handleNext = () => {
    if (validateStepOne()) setStep(2);
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

    try {
      const formattedTime = knowsBirthTime
        ? formData.timeOfBirth.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        : null;

      const response = await userService.register({
        ...formData,
        dateOfBirth: formData.dateOfBirth.toISOString(),
        timeOfBirth: formattedTime,
      });

      if (response.success) {
        Alert.alert("Success", "User registered successfully!", [
          { text: "OK", onPress: () => navigation.replace("WelcomeScreen") }
        ]);
      } else {
        const errorText = response.errors?.[0] || response.message || "Registration failed.";
        Alert.alert("Registration Error", errorText);
      }
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
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
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Full Name"
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              />
              {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
              />
              {errors.email && <Text style={styles.error}>{errors.email}</Text>}

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry
              />
              {errors.password && <Text style={styles.error}>{errors.password}</Text>}

              <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Date of Birth */}
              <Text style={GlobalStyles.text}>Date of Birth</Text>
              <TouchableOpacity style={GlobalStyles.time} onPress={() => setShowDatePicker(true)}>
                <Text style={{ color: theme.colors.background }}>
                  {formData.dateOfBirth.toDateString()}
                </Text>
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
                        Alert.alert("Invalid Date", "Birth date cannot be in the future.");
                        return;
                      }
                      setFormData({ ...formData, dateOfBirth: selectedDate || formData.dateOfBirth });
                    }}
                  />
                  <TouchableOpacity style={GlobalStyles.button} onPress={() => setShowDatePicker(false)}>
                    <Text style={GlobalStyles.buttonText}>Save Date</Text>
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
                <Text style={GlobalStyles.text}>Do you know your birth time?</Text>
              </View>

              {knowsBirthTime && (
                <>
                  <Text style={GlobalStyles.text}>Birth Hour</Text>
                  <TouchableOpacity style={GlobalStyles.time} onPress={() => setShowTimePicker(true)}>
                    <Text style={{ color: theme.colors.background }}>
                      {formData.timeOfBirth.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <>
                      <DateTimePicker
                        value={formData.timeOfBirth}
                        mode="time"
                        textColor="white"

                        display="spinner"
                        onChange={(event, selectedTime) =>
                          setFormData({ ...formData, timeOfBirth: selectedTime || formData.timeOfBirth })
                        }
                      />
                      <TouchableOpacity style={GlobalStyles.button} onPress={() => setShowTimePicker(false)}>
                        <Text style={GlobalStyles.buttonText}>Save Time</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}

              {/* City */}
              <Text style={GlobalStyles.text}>City</Text>
              <TouchableOpacity style={GlobalStyles.inputContainer} onPress={() => setShowCityModal(true)}>
                <Text style={[GlobalStyles.input, { paddingVertical: 15 }]}>
                  {formData.city || "Select City"}
                </Text>
              </TouchableOpacity>

              {/* City Modal */}
              <Modal visible={showCityModal} animationType="slide" transparent>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={GlobalStyles.modalContainer}>
                    <View style={GlobalStyles.modalContent}>
                      <Text style={GlobalStyles.title}>Search City</Text>
                      <TextInput
                        style={GlobalStyles.modalInput}
                        placeholder="Type city name..."
                        placeholderTextColor={theme.colors.neutral}
                        value={searchTerm}
                        onChangeText={(text) => {
                          setSearchTerm(text);
                          searchCities(text);
                        }}
                        autoFocus={true}
                      />
                      {showCityList && (
                        <FlatList
                          data={cities}
                          keyExtractor={(item) => item.id.toString()}
                          keyboardShouldPersistTaps="handled"
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              style={GlobalStyles.cityListItem}
                              onPress={() => {
                                setFormData({ ...formData, cityId: item.id, city: item.name });
                                setShowCityModal(false);
                                Keyboard.dismiss();
                              }}
                            >
                              <Text style={GlobalStyles.cityListItemText}>
                                {item.name}, {item.country}
                              </Text>
                            </TouchableOpacity>
                          )}
                        />
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>

              {/* Pronouns */}
              <Text style={GlobalStyles.text}>Pronouns</Text>
              <View style={GlobalStyles.inputContainer}>
                <TextInput
                  style={GlobalStyles.input}
                  placeholder="Pronouns"
                  placeholderTextColor={theme.colors.text}
                  value={formData.pronouns}
                  onChangeText={(text) => setFormData({ ...formData, pronouns: text })}
                />
              </View>

              {/* Gender */}
              <Text style={GlobalStyles.text}>Gender</Text>
              <View style={GlobalStyles.inputContainer}>
                <TextInput
                  style={GlobalStyles.input}
                  placeholder="Gender"
                  placeholderTextColor={theme.colors.text}
                  value={formData.gender}
                  onChangeText={(text) => setFormData({ ...formData, gender: text })}
                />
              </View>

              {/* Bio */}
              <Text style={GlobalStyles.text}>Bio</Text>
              <View style={GlobalStyles.inputContainer}>
                <TextInput
                  style={[GlobalStyles.input, { height: 100 }]}
                  placeholder="Bio"
                  placeholderTextColor={theme.colors.text}
                  value={formData.bio}
                  onChangeText={(text) => setFormData({ ...formData, bio: text })}
                  multiline
                />
              </View>

              <TouchableOpacity style={GlobalStyles.button} onPress={handleRegister}>
                <Text style={GlobalStyles.buttonText}>Register</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;
