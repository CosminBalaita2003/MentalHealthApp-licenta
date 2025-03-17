import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, 
  ScrollView, TouchableWithoutFeedback, Keyboard, Platform, FlatList, Modal, Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import userService from '../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import GlobalStyles from '../styles/globalStyles';
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
    pronouns: '',
    gender: '',
    bio: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCityList, setShowCityList] = useState(false);

  const navigation = useNavigation();

 
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
      const data = await response.json();
  
      console.log("📥 API Response:", data); // Vezi ce returnează API-ul
  
      // 🔥 Extragem array-ul de orașe din `$values`
      const citiesArray = data?.$values || [];
  
      if (Array.isArray(citiesArray) && citiesArray.length > 0) {
        setCities(citiesArray);
        setShowCityList(true);
        console.log("✅ Cities state updated:", citiesArray);
      } else {
        setCities([]);
        setShowCityList(false);
        console.log("❌ No cities found.");
      }
    } catch (error) {
      console.error("❌ Error fetching cities:", error);
      setCities([]);
      setShowCityList(false);
    }
  };
  const handleRegister = async () => {
    if (!formData.fullName || !formData.email || !formData.password || 
        !formData.city || !formData.gender || !formData.pronouns || !formData.bio) {
        Alert.alert("Eroare", "Toate câmpurile sunt obligatorii.");
        return;
    }

    try {
        const formattedTime = formData.timeOfBirth
            ? formData.timeOfBirth.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
            : "00:00:00";  // Default value dacă timeOfBirth e null

        const userData = { 
            ...formData, 
            dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : new Date().toISOString(),
            timeOfBirth: formattedTime,
        };

        const response = await userService.register(userData);
        console.log("Register Response:", response);

        if (response.success) {
            // Afișăm mesajul și redirecționăm după ce userul apasă "OK"
            Alert.alert("Success", "User registered successfully!", [
                { text: "OK", onPress: () => navigation.replace("WelcomeScreen") }
            ]);
        } else {
            Alert.alert("Eroare", response.message || "A apărut o eroare la înregistrare.");
        }
    } catch (error) {
        console.error("Register error:", error);
        Alert.alert("Eroare", "A apărut o eroare. Te rugăm să încerci din nou.");
    }
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={GlobalStyles.container}
      >
        <ScrollView contentContainerStyle={GlobalStyles.scrollContainer}>
          <Text style={GlobalStyles.title}>Register</Text>

          {step === 1 ? (
            <>
              <Text style={GlobalStyles.text}>Full Name</Text>
              <View style={GlobalStyles.inputContainer}>
                <TextInput 
                  style={GlobalStyles.input} 
                  placeholder="Full Name" 
                  placeholderTextColor={theme.colors.text}
                  value={formData.fullName} 
                  onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                />
              </View>

              <Text style={GlobalStyles.text}>Email</Text>
              <View style={GlobalStyles.inputContainer}>
                <TextInput 
                  style={GlobalStyles.input} 
                  placeholder="Email" 
                  placeholderTextColor={theme.colors.text}
                  value={formData.email} 
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Text style={GlobalStyles.text}>Password</Text>
              <View style={GlobalStyles.inputContainer}>
                <TextInput 
                  style={GlobalStyles.passwordInput} 
                  placeholder="Password" 
                  placeholderTextColor={theme.colors.text}
                  value={formData.password} 
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={GlobalStyles.button} onPress={() => setStep(2)}>
                <Text style={GlobalStyles.buttonText}>Next</Text>
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
                    textColor='white'
                    onChange={(event, selectedDate) => setFormData({ ...formData, dateOfBirth: selectedDate || formData.dateOfBirth })}
                  />
                  <TouchableOpacity style={GlobalStyles.button} onPress={() => setShowDatePicker(false)}>
                    <Text style={GlobalStyles.buttonText}>Save Date</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Birth Hour */}
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
                    display="spinner"
                    textColor='white'
                    onChange={(event, selectedTime) => setFormData({ ...formData, timeOfBirth: selectedTime || formData.timeOfBirth })}
                  />
                  <TouchableOpacity style={GlobalStyles.button} onPress={() => setShowTimePicker(false)}>
                    <Text style={GlobalStyles.buttonText}>Save Time</Text>
                  </TouchableOpacity>
                </>
              )}
              

             {/* City */}
             <Text style={GlobalStyles.text}>City</Text>
              <TouchableOpacity style={GlobalStyles.inputContainer} onPress={() => setShowCityModal(true)}>
                <Text style={[GlobalStyles.input, { textAlignVertical: 'center', paddingVertical: 15 }]}>
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
                        placeholderTextColor={theme.colors.neutral} // 🔹 Mai contrastant
                        value={searchTerm}
                        onChangeText={(text) => {
                          setSearchTerm(text);
                          searchCities(text);
                        }}
                        autoFocus={true}
                      />
                      {showCityList && cities.length > 0 && (
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
                              <Text style={GlobalStyles.cityListItemText}>{item.name}, {item.country}</Text>
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
