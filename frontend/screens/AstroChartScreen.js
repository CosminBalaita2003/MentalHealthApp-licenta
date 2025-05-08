import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { fetchNatalWheelChart, fetchPlanets, fetchHouses, saveNatalChart } from '../services/astroChartService';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import astroStyles from '../styles/astroChartStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import SwipeableDeck from '../components/SwipeableDeck';

const planetData = require('../data/planet_explanations.json');
const houseData = require('../data/house_explanations.json');

const InfoCard = ({ title, description }) => (
  <View style={{
    backgroundColor: '#16132D',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#9f7aea',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  }}>
    <Text style={{ fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>{title}</Text>
    <Text style={{ color: '#ddd' }}>{description}</Text>
  </View>
);

export default function AstroChartScreen({ route, navigation }) {
  const { user } = route.params;
  const [svgContent, setSvgContent] = useState(null);
  const [pngBase64, setPngBase64] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planets, setPlanets] = useState([]);
  const [houses, setHouses] = useState([]);
  const [planetDescriptions, setPlanetDescriptions] = useState([]);
  const [houseDescriptions, setHouseDescriptions] = useState([]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getSavedChart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return null;

      const response = await axios.get(`${API_URL}/api/NatalChart`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data;
    } catch (err) {
      console.error("❌ Error fetching chart:", err.response?.data || err.message);
      return null;
    }
  };

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const cached = await getSavedChart();

        let planetsData = [], housesData = [];

        if (cached) {
          planetsData = JSON.parse(cached.planetsJson);
          housesData = JSON.parse(cached.housesJson);
          setSvgContent(cached.chartSvg);
        } else {
          const chartResult = await fetchNatalWheelChart(user);
          const chartUrl = chartResult?.output;
          if (!chartUrl) {
            Alert.alert("Eroare", "Nu s-a putut obține link-ul către chart.");
            return;
          }

          const svgRes = await axios.get(chartUrl);
          setSvgContent(svgRes.data);
          await sleep(1000);

          const planetsResult = await fetchPlanets(user);
          planetsData = planetsResult?.output || [];

          await sleep(1000);
          const housesResult = await fetchHouses(user);
          housesData = housesResult?.output?.Houses || [];

          await saveNatalChart(svgRes.data, planetsData, housesData);
        }

        setPlanets(planetsData);
        setHouses(housesData);

        const planetExpl = planetsData.map(p =>
          planetData[p.planet]?.[p.zodiacSign] || 'No explanation available.'
        );
        setPlanetDescriptions(planetExpl);

        const houseExpl = housesData.map(h =>
          houseData[`House ${h.house}`]?.[h.zodiacSign] || 'No explanation available.'
        );
        setHouseDescriptions(houseExpl);

      } catch (error) {
        console.error("❌ General error:", error.response?.data || error.message);
        Alert.alert("Eroare", "Nu s-au putut încărca datele astrologice.");
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, []);

  const onWebViewMessage = (event) => {
    const base64 = event.nativeEvent.data;
    setPngBase64(base64);
  };

  const htmlContent = `
    <html>
      <body style="margin:0;padding:0;">
        <canvas id="canvas"></canvas>
        <script>
          const svg = \`${svgContent?.replace(/`/g, '\\`')}\`;
          const canvas = document.getElementById('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const png = canvas.toDataURL('image/png');
            window.ReactNativeWebView.postMessage(png);
            URL.revokeObjectURL(url);
          };
          img.src = url;
        </script>
      </body>
    </html>
  `;

  return (
    <View style={astroStyles.container}>
      <View style={astroStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={astroStyles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={astroStyles.title}>Your Natal Chart</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#E8BCB9" />
          <Text style={{ color: '#E8BCB9', marginTop: 12, fontStyle: 'italic' }}>
            Calculating your natal sky...
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          <Text style={[astroStyles.text, { textAlign: 'center', fontStyle: 'italic', marginHorizontal: 20 }]}>
            The stars kept moving since your birth. This is how the sky looked like that day.
          </Text>

          {pngBase64 && (
            <Image source={{ uri: pngBase64 }} style={astroStyles.chartImage} resizeMode="contain" />
          )}

          {svgContent && !pngBase64 && (
            <WebView
              originWhitelist={['*']}
              source={{ html: htmlContent }}
              onMessage={onWebViewMessage}
              style={{ height: 1, width: 1, opacity: 0 }}
            />
          )}

          <View style={astroStyles.sectionContainer}>
            <View style={astroStyles.sectionHeader}>
              <Ionicons name="planet" size={20} color="#fff" style={astroStyles.sectionIcon} />
              <Text style={astroStyles.sectionTitle}>Planets</Text>
            </View>
            {planets.map((p, index) => (
              <InfoCard
                key={index}
                title={`The ${p.planet} is in ${p.zodiacSign}`}
                description={planetDescriptions[index] || 'Loading...'}
              />
            ))}
          </View>

          <View style={astroStyles.sectionContainer}>
            <View style={astroStyles.sectionHeader}>
              <Ionicons name="home" size={20} color="#fff" style={astroStyles.sectionIcon} />
              <Text style={astroStyles.sectionTitle}>Houses</Text>
            </View>
            {houses.map((h, index) => (
              <InfoCard
                key={index}
                title={`House ${h.house} is in ${h.zodiacSign}`}
                description={houseDescriptions[index] || 'Loading...'}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
