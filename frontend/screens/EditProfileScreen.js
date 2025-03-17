import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, FlatList, Keyboard, 
  TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ActivityIndicator, Modal, ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import userService from '../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../styles/globalStyles';
import theme from '../styles/theme';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    dateOfBirth: new Date(),
    timeOfBirth: new Date(new Date().setHours(12, 0, 0)),
    cityId: '',
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
  

  const navigation = useNavigation();

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
            bio: userResponse.user.bio || '',
            gender: userResponse.user.gender || '',
            pronouns: userResponse.user.pronouns || '',
          });
        } else {
          Alert.alert("Eroare", userResponse.message);
        }
      } catch (error) {
        Alert.alert("Eroare", "Nu s-au putut obține datele utilizatorului.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
  
  
  
  const handleSave = async () => {
    if (!profile.fullName || !profile.cityId || !profile.gender || !profile.pronouns || !profile.bio) {
      Alert.alert("Eroare", "Toate câmpurile sunt obligatorii.");
      console.log(profile);
      return;
    }

    const formattedTime = profile.timeOfBirth.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    const profileData = { 
      ...profile, 
      dateOfBirth: profile.dateOfBirth.toISOString(),
      timeOfBirth: formattedTime
    };

    const result = await userService.editUser(profileData);
    if (result.success) {
      Alert.alert("Succes", result.message);
      navigation.replace("Main");
    } else {
      Alert.alert("Eroare", "Actualizarea a eșuat: " + result.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={GlobalStyles.container}
          >
        <ScrollView contentContainerStyle={GlobalStyles.scrollContainer}>
          
              <Text style={GlobalStyles.title}>Edit Profile</Text>
  
              {loading ? (
                <ActivityIndicator size="large" color={theme.colors.text} />
              ) : (
                <>
                   <Text style={GlobalStyles.text}>Full Name</Text>
                                <View style={GlobalStyles.inputContainer}>
                                  <TextInput 
                                    style={GlobalStyles.input} 
                                    placeholder="Full Name" 
                                    placeholderTextColor={theme.colors.text}
                                    value={profile.fullName} 
                                    onChangeText={(text) => setProfile({ ...profile, fullName: text })}
                                  />
                                </View>
                                <Text style={GlobalStyles.text}>Date of Birth</Text>
              <TouchableOpacity style={GlobalStyles.time} onPress={() => setShowDatePicker(true)}>
                <Text style={{ color: theme.colors.background }}>
                  {profile.dateOfBirth.toDateString()}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <>
                  <DateTimePicker 
                    value={profile.dateOfBirth} 
                    mode="date" 
                    display="spinner"
                    textColor='white'
                    onChange={(event, selectedDate) => setProfile({ ...profile, dateOfBirth: selectedDate || profile.dateOfBirth })}
                  />
                  <TouchableOpacity style={GlobalStyles.button} onPress={() => setShowDatePicker(false)}>
                    <Text style={GlobalStyles.buttonText}>Save Date</Text>
                  </TouchableOpacity>
                </>
              )}
                   <Text style={GlobalStyles.text}>Birth Hour</Text>
              <TouchableOpacity style={GlobalStyles.time} onPress={() => setShowTimePicker(true)}>
                <Text style={{ color: theme.colors.background }}>
                  {profile.timeOfBirth.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
              {showTimePicker && (
                <>
                  <DateTimePicker 
                    value={profile.timeOfBirth} 
                    mode="time" 
                    display="spinner"
                    textColor='white'
                    onChange={(event, selectedTime) => setProfile({ ...profile, timeOfBirth: selectedTime || profile.timeOfBirth })}
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
                                   {profile.city || "Select City"}
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
    keyboardShouldPersistTaps="always"
    style={GlobalStyles.flatListContainer} // 🔥 Aplicăm stilurile noi
    renderItem={({ item }) => (
      <TouchableOpacity 
        style={GlobalStyles.cityListItem} 
        onPress={() => {
          setProfile({ ...profile, cityId: item.id, city: item.name });
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
                                    value={profile.pronouns} 
                                    onChangeText={(text) => setProfile({ ...profile, pronouns: text })}
                                  />
                                </View>
                  
                                {/* Gender */}
                                <Text style={GlobalStyles.text}>Gender</Text>
                                <View style={GlobalStyles.inputContainer}>
                                  <TextInput 
                                    style={GlobalStyles.input} 
                                    placeholder="Gender" 
                                    placeholderTextColor={theme.colors.text}
                                    value={profile.gender} 
                                    onChangeText={(text) => setProfile({ ...profile, gender: text })}
                                  />
                                </View>
                  
                                {/* Bio */}
                                <Text style={GlobalStyles.text}>Bio</Text>
                                <View style={GlobalStyles.inputContainer}>
                                  <TextInput 
                                    style={[GlobalStyles.input, { height: 100 }]} 
                                    placeholder="Bio" 
                                    placeholderTextColor={theme.colors.text}
                                    value={profile.bio} 
                                    onChangeText={(text) => setProfile({ ...profile, bio: text })}
                                    multiline
                                  />
                                </View>
                  <TouchableOpacity style={GlobalStyles.button} onPress={handleSave}>
                    <Text style={GlobalStyles.buttonText}>Save Profile</Text>
                  </TouchableOpacity>
                </>
              )}
             
                    </ScrollView>
                  </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
              );
            };
          

export default EditProfileScreen;
