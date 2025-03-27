import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchUserEntries } from '../services/journalService';
import testService from '../services/testService';
import userService from '../services/userService';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const StreakIndicator = () => {
  const [streak, setStreak] = useState(0);
  const [activeToday, setActiveToday] = useState(false);

  const getDateOnly = (dateStr) => {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const calculateStreak = async () => {
    try {
      const userResponse = await userService.getUser();
      if (!userResponse.success) return;

      const userId = userResponse.user.id;
      const entriesRes = await fetchUserEntries(userId);
      const testsRes = await testService.getUserTests(userId);

      const allDates = [
        ...(entriesRes.entries || []),
        ...(testsRes.tests || [])
      ]
        .map((item) => getDateOnly(item.timestamp || item.date))
        .filter(date => !isNaN(date));

      const uniqueTimestamps = [...new Set(allDates.map(d => d.getTime()))].sort((a, b) => b - a);

      let streakCount = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      setActiveToday(uniqueTimestamps.includes(currentDate.getTime()));

      for (let i = 0; i < uniqueTimestamps.length; i++) {
        if (uniqueTimestamps[i] === currentDate.getTime()) {
          streakCount++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else if (uniqueTimestamps[i] === currentDate.getTime() - 86400000) {
          streakCount++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      setStreak(streakCount);
    } catch (err) {
      console.error('Error calculating streak:', err);
    }
  };

  // 🔁 Se apelează de fiecare dată când revii pe ecran
  useFocusEffect(
    useCallback(() => {
      calculateStreak();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Ionicons
        name={activeToday ? "heart" : "heart-outline"}
        size={26}
        color={activeToday ? "#fff" : "#aaa"}
        style={styles.icon}
      />
      <Text style={styles.text}>{streak} day{streak === 1 ? '' : 's'} streak</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default StreakIndicator;
