import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, FlatList, Keyboard,
  TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ActivityIndicator, Modal, ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import userService from '../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import editStyles from '../styles/editProfileStyles';
import theme from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // sau 'react-native-vector-icons/MaterialIcons'
import editProfileStyles from '../styles/editProfileStyles';

const EditProfileScreen = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    dateOfBirth: new Date(),
    timeOfBirth: new Date(new Date().setHours(12, 0, 0)),
    cityId: '',
    city: '',
  
    bio: '',
    gender: '',
    pronouns: '',
  });

  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCityList, setShowCityList] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCityModal, setShowCityModal] = useState(false);
  const [knowsBirthTime, setKnowsBirthTime] = useState(false);
const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const [savingModalVisible, setSavingModalVisible] = useState(false);
  const [savingMessage, setSavingMessage] = useState('Saving…');
  const navigation = useNavigation();

  const showError = msg => {
    setErrorModalMessage(msg);
    setErrorModalVisible(true);
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userResponse = await userService.getUser();
        if (userResponse.success) {
          setProfile({
            fullName: userResponse.user.fullName || '',
            dateOfBirth: userResponse.user.dateOfBirth
              ? new Date(userResponse.user.dateOfBirth)
              : new Date(),
            timeOfBirth: userResponse.user.timeOfBirth
              ? new Date(`1970-01-01T${userResponse.user.timeOfBirth}`)
              : new Date(new Date().setHours(12, 0, 0)),
            
            cityId: userResponse.user.cityId || '',
            city: userResponse.user.cityName || '',
            
            bio: userResponse.user.bio || '',
            gender: userResponse.user.gender || '',
            pronouns: userResponse.user.pronouns || '',
          });
         
          
        } else {
          showError(userResponse.message);
        }
      } catch (error) {
        showError("Error fetching profile: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  useEffect(() => {
  setKnowsBirthTime(
    profile.timeOfBirth !== null && profile.timeOfBirth !== undefined
  );
}, [profile.timeOfBirth]);

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
        console.log("❌ Bad response:", response.status, textRes);
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
      console.log("🚨 Error fetching cities:", error);
      setCities([]);
      setShowCityList(false);
    }
  };

  const handleSave = async () => {
    if (!profile.fullName || !profile.cityId || !profile.gender || !profile.pronouns || !profile.bio) {
      showError("Please fill in all fields");
      return;
    }

    setSavingMessage('Saving…');
    setSavingModalVisible(true);
    const formattedTime = knowsBirthTime
      ? profile.timeOfBirth.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      : null;

    const profileData = {
      ...profile,
      dateOfBirth: profile.dateOfBirth.toISOString(),
      timeOfBirth: formattedTime,
    };

    const result = await userService.editUser(profileData);
    if (result.success) {
  setSavingMessage('Saved successfully!');
 
    
    
  } else {
    showError("Error updating profile: " + result.message);
  }
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={editStyles.container}
      >
        <ScrollView contentContainerStyle={editStyles.scrollContainer}>
          <Text style={editStyles.title}>Edit Profile</Text>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.text} />
          ) : (
            <>
              {/* Full Name */}
              <Text style={editStyles.text}>Full Name</Text>
              <View style={editStyles.inputContainer}>
                <TextInput
                  style={editStyles.input}
                  placeholder="Full Name"
        placeholderTextColor="#adacad"
                  value={profile.fullName}
                  onChangeText={(text) => setProfile({ ...profile, fullName: text })}
                />
              </View>

              {/* Date of Birth */}
              <Text style={editStyles.text}>Date of Birth</Text>
              <TouchableOpacity style={editStyles.time} onPress={() => setShowDatePicker(true)}>
                <Text style={{ color: 'white' }}>
                  {profile.dateOfBirth.toDateString()}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <>
                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <DateTimePicker
                    value={profile.dateOfBirth}
                    mode="date"
                    display="spinner"
                    textColor="white"
                    onChange={(event, selectedDate) => {
                      const today = new Date();
                      if (selectedDate && selectedDate > today) {
                        Alert.alert("Dată invalidă", "Data de naștere nu poate fi în viitor.");
                        return; // nu actualizăm
                      }
                      setProfile({ ...profile, dateOfBirth: selectedDate || profile.dateOfBirth });
                    }}
                  />
                  </View>



                  <TouchableOpacity style={editStyles.button} onPress={() => setShowDatePicker(false)}>
                    <Text style={editStyles.buttonText}>Save Date</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Birth Time */}
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
                              <Text style={editProfileStyles.label}>Do you know your birth time?</Text>
                            </View>

              {knowsBirthTime && (
                <>
                  <Text style={editStyles.text}>Birth Hour</Text>
                  <TouchableOpacity style={editStyles.time} onPress={() => setShowTimePicker(true)}>
                    <Text style={{ color: 'white' }}>
                      {profile.timeOfBirth.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <>
                                     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <DateTimePicker
                        value={profile.timeOfBirth}
                        mode="time"
                        display="spinner"
                        textColor="white"
                        onChange={(event, selectedTime) =>
                          setProfile({ ...profile, timeOfBirth: selectedTime || profile.timeOfBirth })
                        }
                      />
                      </View>
                      <TouchableOpacity style={editStyles.button} onPress={() => setShowTimePicker(false)}>
                        <Text style={editStyles.buttonText}>Save Time</Text>
                      </TouchableOpacity>
                    </>
                    
                  )}
                </>
              )}

              {/* City */}
              <Text style={editStyles.text}>City</Text>
              <TouchableOpacity style={editStyles.inputContainer} onPress={() => setShowCityModal(true)}>
                <Text style={[editStyles.input, { paddingVertical: 0 }]}>
                  {profile.city ? `${profile.city}` : "Select City"}
                </Text>
              </TouchableOpacity>

              {/* City Modal */}
             <Modal visible={showCityModal} animationType="slide" transparent>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={editStyles.modalContainer}>
      <View style={editStyles.modalContent}>
        <Text style={editStyles.title}>Search City</Text>

        <View style={editStyles.modalInputContainer}>
          <MaterialIcons
            name="search"
            size={20}
            color={theme.colors.accent}
            style={editStyles.searchIcon}
          />
           <TextInput
    style={editStyles.modalInput}
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
                  style={editStyles.cityListItem}
                  onPress={() => {
                    setProfile({ ...profile, cityId: item.id, city: item.name});
                    setShowCityModal(false);
                    Keyboard.dismiss();
                  }}
                >
                  <Text style={editStyles.cityListItemText}>
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
              <Text style={editStyles.text}>Pronouns</Text>
              <View style={editStyles.inputContainer}>
                <TextInput
                  style={editStyles.input}
                  placeholder="Pronouns"
                  placeholderTextColor="#adacad"
                  value={profile.pronouns}
                  onChangeText={(text) => {
                    if (text.endsWith(' ')) {
                      text = text.slice(0, -1) + '/';
                    }
                    setProfile({ ...profile, pronouns: text });
                  }}
                />
              </View>

              {/* Gender */}
              <Text style={editStyles.text}>Gender</Text>
              <View style={editStyles.inputContainer}>
                <TextInput
                  style={editStyles.input}
                  placeholder="Gender"
        placeholderTextColor="#adacad"
                  value={profile.gender}
                  onChangeText={(text) => setProfile({ ...profile, gender: text })}
                />
              </View>

             

              <TouchableOpacity style={editStyles.button} onPress={handleSave}>
                <Text style={editStyles.buttonText}>Save Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
          {/* Modal de eroare */}
        <Modal visible={errorModalVisible} transparent animationType="fade">
          <View style={editStyles.errorOverlay}>
            <View style={editStyles.errorContent}>
              <Text style={editStyles.errorText}>{errorModalMessage}</Text>
              <TouchableOpacity style={editStyles.errorButton} onPress={()=>setErrorModalVisible(false)}>
                <Text style={editStyles.errorButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de saving */}
        <Modal visible={savingModalVisible} transparent animationType="fade">
          <View style={editStyles.loadingOverlay}>
            <View style={editStyles.loadingContent}>
              {savingMessage === 'Saving…' ? (
                <>
                  <ActivityIndicator size="large" color={theme.colors.accent}/>
                  <Text style={editStyles.loadingText}>{savingMessage}</Text>
                </>
              ) : (
                <>
                  <Text style={editStyles.loadingText}>{savingMessage}</Text>
                  <TouchableOpacity
                    style={editStyles.errorButton}
                    onPress={() => {
                      navigation.replace("Main");
                      setSavingModalVisible(false);
                    }}
                  >
                    <Text style={editStyles.errorButtonText}>OK</Text>
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

export default EditProfileScreen;
