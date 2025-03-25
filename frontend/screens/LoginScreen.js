import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView,
  ScrollView, TouchableWithoutFeedback, Keyboard, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import userService from '../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import GlobalStyles from '../styles/globalStyles';
import theme from '../styles/theme';
import { useContext } from 'react';
import { AuthContext } from '../App';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const { setIsAuthenticated } = useContext(AuthContext);
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Te rog introdu un email și o parolă.");
      return;
    }

    const response = await userService.login(email, password);
    if (response.success) {
      const userResponse = await userService.getUser();
      if (userResponse.success) {
        await AsyncStorage.setItem('user', JSON.stringify(userResponse.user));

        console.log(" User authenticated, updating state...");

        // 🔥 Setează `isAuthenticated` înainte de a naviga
        setIsAuthenticated(true);

        console.log("📌 Waiting for authentication state to update...");

        // 🔥 Așteptăm puțin pentru a lăsa `App.js` să proceseze schimbarea
        setTimeout(() => {
          console.log(" Navigating to Main...");
          // navigation.reset({
          //   index: 0,
          //   routes: [{ name: 'Main' }],
          // });
        }, 500);
      } else {
        alert("Eroare: " + userResponse.message);
      }
    } else {
      alert("Eroare: " + response.message);
    }
  };





  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={GlobalStyles.container}
      >
        <ScrollView contentContainerStyle={GlobalStyles.scrollContainer}>
          <Text style={GlobalStyles.title}>Login</Text>

          {/* Email Input */}
          <View style={GlobalStyles.inputContainer}>
            <TextInput
              style={GlobalStyles.input}
              placeholder="Email"
              placeholderTextColor={theme.colors.background}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <View style={GlobalStyles.inputContainer}>
            <TextInput
              style={GlobalStyles.passwordInput}
              placeholder="Password"
              placeholderTextColor={theme.colors.background}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={GlobalStyles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={GlobalStyles.button} onPress={handleLogin}>
            <Text style={GlobalStyles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Register Navigation */}
          <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
            <Text style={GlobalStyles.linkText}>Nu ai cont? Creează unul</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
