import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import GlobalStyles from "../styles/globalStyles";
import userService from "../services/userService";
import testService from "../services/testService";
import TestStatistics from "../components/TestStatistics";
import GAD7Test from "../components/GAD7Test";
import PSS10Test from "../components/StressTest";

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

  if (loading) {
    return (
      <View style={[GlobalStyles.container, { backgroundColor: "#16132D" }]}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#16132D" }}>
      {activeSection ? (
        <View style={{ flex: 1 }}>
          {activeSection === "statistics" ? (
            <TestStatistics tests={tests} onBack={() => setActiveSection(null)} />
          ) : (
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
              {activeSection === "GAD7Test" && <GAD7Test user={user} onClose={() => setActiveSection(null)} />}
              {activeSection === "PSS10Test" && <PSS10Test user={user} onClose={() => setActiveSection(null)} />}
            </ScrollView>
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={[GlobalStyles.scrollContainer, { paddingBottom: 120 }]} keyboardShouldPersistTaps="handled">
          <Text style={GlobalStyles.title}>Mental Health Tests</Text>

          <TouchableOpacity style={GlobalStyles.button} onPress={() => setActiveSection("statistics")}>
            <Text style={GlobalStyles.buttonText}>Show Statistics</Text>
          </TouchableOpacity>

          <TouchableOpacity style={GlobalStyles.button} onPress={() => setActiveSection("GAD7Test")}>
            <Text style={GlobalStyles.buttonText}>Start Anxiety Test (GAD-7)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={GlobalStyles.button} onPress={() => setActiveSection("PSS10Test")}>
            <Text style={GlobalStyles.buttonText}>Start Stress Test (PSS-10)</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

export default TestScreen;
