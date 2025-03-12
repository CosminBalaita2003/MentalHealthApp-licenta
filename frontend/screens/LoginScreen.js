import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

import userService from '../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import GlobalStyles from '../styles/globalStyles';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    const response = await userService.login(email, password);
    if (response.success) {
      const userResponse = await userService.getUser();

      if (userResponse.success) {
        const user = userResponse.user;
        await AsyncStorage.setItem('user', JSON.stringify(user));
        // Redirect to HomeScreen
        navigation.replace('HomeScreen');
      } else {
        Alert.alert("Eroare", userResponse.message);
      }
    } else {
      Alert.alert("Eroare", response.message);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Login</Text>
      <TextInput style={GlobalStyles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={GlobalStyles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={GlobalStyles.button} onPress={handleLogin}>
        <Text style={GlobalStyles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
