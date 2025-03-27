import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView,
  ScrollView, TouchableWithoutFeedback, Keyboard, Platform
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
        const user = userResponse.user;
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('userId', user.id);
        setIsAuthenticated(true);
        setTimeout(() => {
          console.log(" Navigating to Main...");
          // navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
