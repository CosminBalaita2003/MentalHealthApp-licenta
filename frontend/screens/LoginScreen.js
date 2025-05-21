import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView,
  ScrollView, TouchableWithoutFeedback, Keyboard, Platform,  Modal, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import userService from '../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/authStyles';
import theme from '../styles/theme';
import { AuthContext } from '../App';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { setIsAuthenticated } = useContext(AuthContext);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

   const showError = msg => {
    setErrorMessage(msg);
    setErrorVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
 showError("Please fill in all fields");
       return;
    }

    const response = await userService.login(email, password);
    if (response.success) {
      const userResponse = await userService.getUser();
      if (userResponse.success) {
        const user = userResponse.user;
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('userId', user.id);
       
        setLoadingModalVisible(true);

        setTimeout(() => {
          console.log(" Navigating to Main...");
          setLoadingModalVisible(false);
           setIsAuthenticated(true);
          // navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
        }, 2000);
      } else {
       showError("Eroare: " + userResponse.message);
      }
    } else {
      showError("Eroare: " + response.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Login</Text>

          {/* Email Input */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Password Input */}
          <Text style={styles.label}>Password</Text>
          <View style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <TextInput
              style={{ color: '#fff', flex: 1 }}
              placeholder="Password"
              placeholderTextColor="#fff"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Navigation */}
          <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
            <Text style={[styles.text, { textAlign: 'center', marginTop: 20 }]}>
              Nu ai cont? Creează unul
            </Text>
          </TouchableOpacity>
        </ScrollView>
         {/* Modal-ul de eroare */}
        <Modal visible={errorVisible} transparent animationType="fade">
          <View style={styles.errorOverlay}>
            <View style={styles.errorContent}>
              <Text style={styles.errorText}>{errorMessage}</Text>
              <TouchableOpacity
                style={styles.errorButton}
                onPress={()=>setErrorVisible(false)}
              >
                <Text style={styles.errorButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

         <Modal visible={loadingModalVisible} transparent animationType="fade">
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color={theme.colors.semiaccent} />
              <Text style={styles.loadingText}>Logging in...</Text>
            </View>
          </View>
        </Modal>


      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
