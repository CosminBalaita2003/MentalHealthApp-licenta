import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator , Platform,
    KeyboardAvoidingView, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import userService from "../services/userService";
import testService from "../services/testService";
import TestStatistics from "../components/TestStatistics";
import GAD7Test from "../components/GAD7Test";
import PSS10Test from "../components/StressTest";
import styles from "../styles/testScreenStyles";
import PHQ9Test from "../components/PHQ9Test";
const TestScreen = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userResponse = await userService.getUser();
      if (userResponse.success) {
        setUser(userResponse.user);
        const testResponse = await testService.getUserTests(userResponse.user.id);
        if (testResponse.success) {
          setTests(testResponse.tests);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);
  const handleCloseSection = async () => {
    setActiveSection(null);
  
    // 🔄 Reîncarcă testele după revenirea dintr-un test
    const userResponse = await userService.getUser();
    if (userResponse.success) {
      setUser(userResponse.user);
      const testResponse = await testService.getUserTests(userResponse.user.id);
      if (testResponse.success) {
        setTests(testResponse.tests);
      }
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  if (activeSection) {
    return (
      <View style={{ flex: 1 }}>
        {activeSection === "statistics" ? (
          <TestStatistics tests={tests} onBack={() => setActiveSection(null)} />
        ) : (
          <View style={{ flex: 1 }}>
  {activeSection === "GAD7Test" && <GAD7Test user={user} onClose={handleCloseSection} />}
{activeSection === "PSS10Test" && <PSS10Test user={user} onClose={handleCloseSection} />}
{activeSection === "PHQ9Test" && <PHQ9Test user={user} onClose={handleCloseSection} />}

        
</View>

        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#16132D" }}>
 <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >        
      <Text style={styles.title}>Mental Health Tests</Text>
        <View style={styles.divider}>

         {tests.length > 0 && (
  <TouchableOpacity style={styles.card} onPress={() => setActiveSection("statistics")}>
    <Ionicons name="bar-chart-outline" size={20} color="#000" marginRight={10}/>
    <Text style={styles.cardText}>Show Statistics</Text>
  </TouchableOpacity>
)}


          <TouchableOpacity style={styles.card} onPress={() => setActiveSection("GAD7Test")}>
            <Ionicons name="pulse-outline" size={20} color="#000" marginRight={10}/>
            <Text style={styles.cardText}>Start Anxiety Test (GAD-7)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => setActiveSection("PSS10Test")}>
            <Ionicons name="flash-outline" size={20} color="#000" marginRight={10}/>
            <Text style={styles.cardText}>Start Stress Test (PSS-10)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => setActiveSection("PHQ9Test")}>
  <Ionicons name="cloud-outline" size={20} color="#000" marginRight={10} />
  <Text style={styles.cardText}>Start Depression Test (PHQ-9)</Text>
</TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default TestScreen;
