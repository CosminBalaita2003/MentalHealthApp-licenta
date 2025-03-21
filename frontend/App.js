import React, { useState, useEffect, createContext } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalStyles from "./styles/globalStyles";
import { fetchUserData } from "./services/authService"; // ✅ Import serviciul de autentificare
// Import screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ExercicesScreen from "./screens/ExercicesScreen";

import TestScreen from "./screens/TestScreen";
import ProfileScreen from "./screens/ProfileScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import JournalScreen from "./screens/JournalScreen";
import NewEntryScreen from "./screens/NewEntryScreen";

export const AuthContext = createContext();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#16132D",
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute",
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          color: "#ffffff",
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === "Exercises") iconName = "barbell-outline";
          else if (route.name === "Journal") iconName = "book-outline";
          else if (route.name === "Test") iconName = "clipboard-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={focused ? "#4ECDC4" : "#ffffff"} />;
        },
      })}
    >
      <Tab.Screen name="Exercises" component={ExercicesScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Test" component={TestScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Verificare autentificare...");
      const user = await fetchUserData(setIsAuthenticated);
      console.log("User data:", user);
      setLoading(false);
    };
  
    checkAuth();
  }, []);
  

  if (loading) {
    return (
      setLoading(false),
      <View style={GlobalStyles.container}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Main" component={TabNavigator} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="JournalScreen" component={JournalScreen} />
              <Stack.Screen name="NewEntryScreen" component={NewEntryScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
