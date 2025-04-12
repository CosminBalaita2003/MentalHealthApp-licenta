import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchUserEntries } from '../services/journalService';
import testService from '../services/testService';
import userService from '../services/userService';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getUserProgress} from '../services/progressService';


const StreakIndicator = () => {
  const [streak, setStreak] = useState(0);
  const [activeToday, setActiveToday] = useState(false);

  const getDateOnly = (dateStr) => {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateStreak = async () => {
    try {
      const userResponse = await userService.getUser();
      if (!userResponse.success) return;

      const userId = userResponse.user.id;
      const entriesRes = await fetchUserEntries(userId);
      const testsRes = await testService.getUserTests(userId);

      const progressRes = await getUserProgress();
const allDates = [
  ...(entriesRes.entries || []),
  ...(testsRes.tests || []),
  ...(progressRes || [])
]
  .map((item) => getDateOnly(item.timestamp || item.date)) // `timestamp` pt jurnale și teste, `date` pt progres
  .filter(date => !isNaN(date));


      console.log("📅 Toate datele brute (cu ore resetate):", allDates.map(d => formatDateLocal(d)));

      const uniqueTimestamps = [...new Set(allDates.map(d => d.getTime()))].sort((a, b) => b - a);

      const dateSet = new Set(uniqueTimestamps.map(ts => {
        const d = new Date(ts);
        d.setHours(0, 0, 0, 0);
        return formatDateLocal(d);
      }));

      console.log("🗓️ Date unice (YYYY-MM-DD):", Array.from(dateSet));

      let streakCount = 0;
      const now = new Date();
      let currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let currentDateStr = formatDateLocal(currentDate);
      
      // detectăm dacă e activ azi
      const todayActive = dateSet.has(currentDateStr);
      setActiveToday(todayActive);
      
      // dacă NU e activ azi, începem streak-ul de la ieri
      if (!todayActive) {
        currentDate.setDate(currentDate.getDate() - 1);
        currentDateStr = formatDateLocal(currentDate);
      }
      
      // acum calculăm streak-ul
      while (dateSet.has(currentDateStr)) {
        console.log("Streak activ pentru:", currentDateStr);
        streakCount++;
        currentDate.setDate(currentDate.getDate() - 1);
        currentDateStr = formatDateLocal(currentDate);
      }
      console.log("Streak-ul final:", streakCount);
      
      setStreak(streakCount);
    }
    catch (error) {
      console.error("Error calculating streak:", error);
      setStreak(0);
      setActiveToday(false);
    }

  };

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
      <Text style={styles.text}>
        {streak} day{streak === 1 ? '' : 's'} streak
        {activeToday ? '' : ''}
      </Text>
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
