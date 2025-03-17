import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/globalStyles';
import theme from '../styles/theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>MindEase</Text>

      <TouchableOpacity style={[globalStyles.button, { backgroundColor: theme.colors.semiaccent}]} onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={globalStyles.buttonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={globalStyles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}
