import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView,
  ScrollView, TouchableWithoutFeedback, Keyboard, Platform,
  FlatList, Modal, Alert, ActivityIndicator 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import userService from '../services/userService';
import styles from '../styles/authStyles';
import theme from '../styles/theme';
import { analyzeTextEmotion } from "../services/journalService";
import { MaterialIcons } from '@expo/vector-icons'; // sau 'react-native-vector-icons/MaterialIcons'



const RegisterScreen = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    dateOfBirth: new Date(),
    timeOfBirth: new Date(new Date().setHours(12, 0, 0)),
    cityId: '',
    city: '',
    country: '',
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
  const [quizAnswers, setQuizAnswers] = useState({
    hobbies: '',
    personality: '',
    weekend: '',
    quote: '',
    motivation: '',
    improvement: '',
  });
  const [quizError, setQuizError] = useState(false);
  const [checkingMeaning, setCheckingMeaning] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

   const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const [registrationModalVisible, setRegistrationModalVisible] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('Registering…');

 const showError = (msg) => {
    setErrorModalMessage(msg);
    setErrorModalVisible(true);
  };

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
  const validateAnswer = async (text) => {
    const trimmed = text.trim();
    const isRegexValid = trimmed.length >= 5 && /[a-zA-Z]/.test(trimmed);
    if (!isRegexValid) return false;

    try {
      const result = await analyzeTextEmotion(trimmed);
      return result.success && !!result.dominantEmotion;
    } catch (e) {
      console.log(" x x x x x x x AI validation failed:", e);
      return false;
    }
  };

useEffect(() => {
    if (!formData.email || !emailValid) {
      setEmailExists(false);
      setCheckingEmail(false);
      return;
    }
    setCheckingEmail(true);
    const handler = setTimeout(async () => {
      try {
        const exists = await userService.checkEmailExists(formData.email);
        setEmailExists(exists);
      } catch (e) {
        console.log("x x x x x Email check failed:", e);
        // eventual afişezi un text de eroare generală
      } finally {
        setCheckingEmail(false);
      }
    }, 500); // debounce 500ms

    return () => clearTimeout(handler);
  }, [formData.email]);

  const handleNext = () => {
    if (!formData.fullName || !emailValid || emailExists /* …altele… */) {
       if (!formData.fullName) {
      showError("Full Name is required.");}
      else if (!emailValid) {
       showError("!Invalid email format! \n Required format: example@domain.com");
      } else if (emailExists) {
        showError("Email already in use.");
      } else {
        showError("Complete all fields.");
      }
      return;
    }
    const missing = [];
  if (!passLength) missing.push("at least 6 characters");
  if (!passUpper) missing.push("an uppercase letter");
  if (!passSpecial) missing.push("a special character");

  if (missing.length > 0) {
    showError(
      "Password must contain:\n" + missing.map(m => `• ${m}`).join("\n")
    );
    return;
  }
    setStep(2);
  };

  const handleRegister = async (dataOverride) => {
    const data = dataOverride || formData;
    const today = new Date();
    

    if (data.dateOfBirth > today) {
      showError("Date of birth cannot be in the future.");
      return;
    }

    if (!data.cityId || !data.gender || !data.pronouns || !data.bio) {
      showError("All fields are required.");
      return;
    }

    const formattedTime = knowsBirthTime
      ? data.timeOfBirth.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      : null;

    setRegistrationMessage('Registering…');
    setRegistrationModalVisible(true);
    setIsRegistering(true);

    try {
      const response = await userService.register({
        ...data,
        dateOfBirth: data.dateOfBirth.toISOString(),
        timeOfBirth: formattedTime,
      });

      setIsRegistering(false); // ✅ done

  //     if (response.success) {
  //       Alert.alert("Success", "User registered successfully!", [
  //         { text: "OK", onPress: () => navigation.replace("WelcomeScreen") },
  //       ]);
  //     } else {
  //       const errorMsg = response.errors?.[0] || response.message || "Registration failed.";
  //       Alert.alert("Registration Error", errorMsg);
  //     }
  //   } catch (error) {
  //     setIsRegistering(false); // ❌ fail
  //     console.error("Register error:", error);
  //     Alert.alert("Error", "An unexpected error occurred.");
  //   }
  // };
  if (response.success) {
        setRegistrationMessage('Registered successfully!');
      } else {
        setRegistrationModalVisible(false);
        showError(response.message || 'Registration failed.');
      }
    } catch (e) {
      setRegistrationModalVisible(false);
      showError('An unexpected error occurred.');
    } finally {
      setIsRegistering(false);
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
    const response = await fetch(`${process.env.API_URL}/api/City/search?name=${text}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const citiesArray = data?.$values || data;

    if (Array.isArray(citiesArray) && citiesArray.length > 0) {
      setCities(citiesArray);
    } else {
      setCities([]);         // niciun oraș găsit
    }
    setShowCityList(true);   // arată fie lista, fie textul “No cities found”
  } catch (error) {
    // console.error("🚨 Error fetching cities:", error);
    setCities([]);           // la eroare tot goale
    setShowCityList(true);   // dar afișăm fallback-ul
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
          {isRegistering && (
            <Text style={{ color: "lightblue", marginBottom: 10, textAlign: "center" }}>
              Registering...
            </Text>
          )}


          {step === 1 && (
            <>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#adacad"
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              />

               <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        placeholderTextColor="#adacad"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={text => setFormData({ ...formData, email: text })}
      />

      {/* Mesaje de validare / loading */}
      {checkingEmail && <ActivityIndicator size="small" />}
      {!checkingEmail && formData.email !== '' && (
        <>
          {!emailValid && (
            <Text style={{ color: 'red' }}>✗ Invalid email format</Text>
          )}
          {emailValid && emailExists && (
            <Text style={{ color: 'red' }}>✗ Email already in use</Text>
          )}
          {emailValid && !emailExists && (
            <Text style={{ color: 'lightgreen' }}>✓ Email available</Text>
          )}
        </>
      )}
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#adacad"
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
          )}
          {step === 2 && (
            <>
              {/* Date of Birth */}
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity style={styles.time} onPress={() => setShowDatePicker(true)}>
                <Text style={{ color: '#fff' }}>{formData.dateOfBirth.toDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <DateTimePicker
                      value={formData.dateOfBirth}
                      mode="date"
                      display="spinner"
                      textColor="white"

                      onChange={(event, selectedDate) => {
                        const today = new Date();
                        if (selectedDate && selectedDate > today) {
                          showError("Date cannot be in the future.");
                          return;
                        }
                        setFormData({ ...formData, dateOfBirth: selectedDate || formData.dateOfBirth });
                      }}
                    />
                  </View>
                  <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.buttonText}>Save Date</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Time of Birth */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 10 }}>
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
                    <Text style={{ color: '#fff' }}>
                      {formData.timeOfBirth.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <DateTimePicker
                          value={formData.timeOfBirth}
                          mode="time"
                          display="spinner"
                          textColor="white"


                          onChange={(event, selectedTime) =>
                            setFormData({ ...formData, timeOfBirth: selectedTime || formData.timeOfBirth })
                          }
                        />
                      </View>
                      <TouchableOpacity style={styles.button} onPress={() => setShowTimePicker(false)}>
                        <Text style={styles.buttonText}>Save Time</Text>
                      </TouchableOpacity>
                    </>

                  )}
                </>
              )}

              {/* City */}
              <Text style={styles.label}>City</Text>
              <TouchableOpacity style={styles.inputContainer} onPress={() => setShowCityModal(true)}>
                <Text style={[styles.input, { paddingVertical: 15 }]}>
                 {formData.city ? `${formData.city}, ${formData.country}` : "Select City"}
                </Text>
              </TouchableOpacity>

              {/* City Modal */}
              {/* <Modal visible={showCityModal} animationType="slide" transparent>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.title}>Search City</Text>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Type city name..."
                        autoComplete='off'
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
              </Modal> */}

              <Modal visible={showCityModal} animationType="slide" transparent>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Search City</Text>

        <View style={styles.modalInputContainer}>
          <MaterialIcons
            name="search"
            size={20}
            color={theme.colors.accent}
            style={styles.searchIcon}
          />
           <TextInput
    style={styles.modalInput}
    placeholder="Type city name..."
    autoComplete="off"
    autoCorrect={false}
    placeholderTextColor={theme.colors.black}
    value={searchTerm}
    onChangeText={(text) => {
      // 1. Elimină toate spațiile de la început
      const trimmed = text.trimStart();
      // 2. Actualizează state-ul și declanșează căutarea
      setSearchTerm(trimmed);
      searchCities(trimmed);
    }}
    autoFocus
  />
        </View>

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
                    setFormData({ ...formData, cityId: item.id, city: item.name, country: item.country });
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
  placeholderTextColor="#adacad"
  value={formData.pronouns}
  onChangeText={(text) => {
    // Dacă ultimul caracter e un spațiu, îl înlocuim cu '/'
    if (text.endsWith(' ')) {
      text = text.slice(0, -1) + '/';
    }
    setFormData({ ...formData, pronouns: text });
  }}
/>


              {/* Gender */}
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={styles.input}
                placeholder="Gender"
                placeholderTextColor="#adacad"
                value={formData.gender}
                onChangeText={(text) => setFormData({ ...formData, gender: text })}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (!formData.cityId || !formData.gender || !formData.pronouns) {
                    Alert.alert("Error", "All fields are required.");
                    return;
                  }
                  setStep(3);
                }}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>

            </>
          )}
          {step === 3 && (
            <>
              {/* === Step 3: Quiz === */}
              <Text style={styles.label}>What are your hobbies?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., reading, hiking, painting"
                placeholderTextColor="#adacad"
                value={quizAnswers.hobbies}
                onChangeText={(text) => setQuizAnswers({ ...quizAnswers, hobbies: text })}
              />

              <Text style={styles.label}>How would you describe yourself?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., introverted, creative, logical"
                placeholderTextColor="#adacad"
                value={quizAnswers.personality}
                onChangeText={(text) => setQuizAnswers({ ...quizAnswers, personality: text })}
              />

              <Text style={styles.label}>What does your ideal weekend look like?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., hiking, cozy indoors, party with friends"
                placeholderTextColor="#adacad"
                value={quizAnswers.weekend}
                onChangeText={(text) => setQuizAnswers({ ...quizAnswers, weekend: text })}
              />

              <Text style={styles.label}>Favorite quote or motto?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 'Stay hungry, stay foolish.'"
                placeholderTextColor="#adacad"
                value={quizAnswers.quote}
                onChangeText={(text) => setQuizAnswers({ ...quizAnswers, quote: text })}
              />
              <Text style={styles.label}>What motivates you in life?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., helping others, achieving goals"
                placeholderTextColor="#adacad"
                value={quizAnswers.motivation}
                onChangeText={(text) => setQuizAnswers({ ...quizAnswers, motivation: text })}
              />

              <Text style={styles.label}>What’s one thing you'd like to improve about yourself?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., confidence, patience, focus"
                placeholderTextColor="#adacad"
                value={quizAnswers.improvement}
                onChangeText={(text) => setQuizAnswers({ ...quizAnswers, improvement: text })}
              />

              {quizError && (
                <Text style={{ color: "red", marginVertical: 10, textAlign: "center" }}>
                  Please write meaningful answers in all fields.
                </Text>
              )}

             <TouchableOpacity
  style={[styles.button, { opacity: checkingMeaning ? 0.6 : 1 }]}
  disabled={checkingMeaning}
  onPress={async () => {
    const { hobbies, personality, weekend, quote, motivation, improvement } = quizAnswers;
    const allFields = [hobbies, personality, weekend, quote, motivation, improvement];

    // Resetăm eroarea de quiz
    setQuizError(false);

    // Validare minimă locală
    if (allFields.some(ans => ans.trim().length < 5 || !/[a-zA-Z]/.test(ans))) {
      setQuizError(true);
      return;
    }

    // Începem validarea AI
    setCheckingMeaning(true);
    let allOk = true;
    for (const text of allFields) {
      const ok = await validateAnswer(text);
      console.log("AI validation for", text, "->", ok);
      if (!ok) {
        allOk = false;
        showError("Unul dintre răspunsuri nu a trecut validarea AI.");
        break;  // iesim din buclă
      }
    }

    // Resetăm indicatorul de încărcare înainte de orice return
    setCheckingMeaning(false);

    if (!allOk) {
      // Dacă vreun răspuns e invalid, nu continuăm
      return;
    }

    // Toate au trecut validarea AI: construim bio și apelăm înregistrarea
    const compiledBio = `
Hobbies: ${hobbies}
Personality: ${personality}
Ideal Weekend: ${weekend}
Favorite Quote: ${quote}
Motivation: ${motivation}
Self-Improvement Goal: ${improvement}`.trim();

    setFormData(prev => {
      const updated = { ...prev, bio: compiledBio };
      // Apelează înregistrarea imediat
      setTimeout(() => handleRegister(updated), 0);
      return updated;
    });
  }}
>
  <Text style={styles.buttonText}>Register</Text>
</TouchableOpacity>

            </>
          )}

        </ScrollView>
    {/* Error Modal */}
<Modal visible={errorModalVisible} transparent animationType="fade">
  <View style={styles.errorOverlay}>
    <View style={styles.errorContent}>
      {/* Poţi păstra × pentru închidere
      <TouchableOpacity
        style={styles.errorClose}
        onPress={() => setErrorModalVisible(false)}
      >
        <Text style={styles.errorCloseText}>×</Text>
      </TouchableOpacity> */}

      {/* Mesajul de eroare */}
      <Text style={styles.errorText}>{errorModalMessage}</Text>

      {/* Butonul OK */}
      <TouchableOpacity
        style={styles.errorButton}
        onPress={() => setErrorModalVisible(false)}
      >
        <Text style={styles.errorButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


        {/* Registration Modal */}
        <Modal
          visible={registrationModalVisible}
          transparent
          animationType="fade"
        >
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
            {registrationMessage === 'Registering…' ? (
              <>
                <ActivityIndicator size="large" color={theme.colors.accent} />
                <Text style={styles.loadingText}>{registrationMessage}</Text>
              </>
            ) : (
              <>
                <Text style={styles.loadingText}>{registrationMessage}</Text>
                <TouchableOpacity
                  style={styles.errorButton}
                  onPress={() => navigation.replace("WelcomeScreen")}
                >
                  <Text style={styles.errorButtonText}>OK</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;
