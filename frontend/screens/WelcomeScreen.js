import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/welcomeStyles';
import theme from '../styles/theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MindWell</Text>
      <Text style={styles.subtitle}>Welcome! Let’s take care of your mental wellbeing.</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.semiaccent }]}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}
