import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Bine ai venit!</Text>
      <Text style={globalStyles.text}>Alege o optiune pentru a continua:</Text>

      <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={globalStyles.buttonText}>Autentificare</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[globalStyles.button, { backgroundColor: '#CBAACB' }]} onPress={() => navigation.navigate('Register')}>
        <Text style={globalStyles.buttonText}>inregistreaza-te</Text>
      </TouchableOpacity>
    </View>
  );
}
