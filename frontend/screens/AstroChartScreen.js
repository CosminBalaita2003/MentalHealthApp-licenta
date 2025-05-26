import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, Alert, TouchableOpacity, ScrollView , Modal } from 'react-native';
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


const InfoCard = ({ title, description }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const firstParagraph = description.split('\n\n')[0] || description.split('\n')[0] || description;

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.9}>
        <View style={astroStyles.tarotCard}>
          <Text style={astroStyles.cardTitle}>{title}</Text>
          <Text style={astroStyles.cardDescription}>{firstParagraph}</Text>
          <Text style={astroStyles.showMore}>Press to see more</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={astroStyles.modalOverlay}>
          <View style={astroStyles.modalContent}>
            <Text style={astroStyles.cardTitle}>{title}</Text>
            <ScrollView style={astroStyles.modalScrollView} showsVerticalScrollIndicator={false}>
  <Text style={astroStyles.cardDescription}>{description}</Text>
</ScrollView>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={astroStyles.modalCloseButton}>
              <Text style={astroStyles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

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
    if (err.response?.status === 404) {
      return null; // nu mai loga nimic pt 404
    }
    console.error("❌ Error fetching chart:", err.response?.data || err.message);
    return null;
  }
};

useEffect(() => {
  const loadChartData = async () => {
    setLoading(true);

    try {
      const cached = await getSavedChart();

      const hasChart = cached?.planetsJson && cached?.housesJson && cached?.chartSvg;

      if (!hasChart) {
        // 🪐 NU avem chart => îl generăm și-l salvăm
        const chartResult = await fetchNatalWheelChart(user);
        const chartUrl = chartResult?.output;
        if (!chartUrl) {
          Alert.alert("Eroare", "Nu s-a putut obține link-ul către chart.");
          return;
        }

        const svgRes = await axios.get(chartUrl);
        await sleep(500);

        const planetsResult = await fetchPlanets(user);
        const planetsData = planetsResult?.output || [];

        await sleep(500);

        const housesResult = await fetchHouses(user);
        const housesData = housesResult?.output?.Houses || [];

        await saveNatalChart(svgRes.data, planetsData, housesData);

        // Reîncarcă totul din backend
        return loadChartData();
      }

      // ✅ Chart existent: extragem și setăm datele
      const planetsData = JSON.parse(cached.planetsJson);
      const housesData = JSON.parse(cached.housesJson);
      setSvgContent(cached.chartSvg);
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
          {/* <Text style={[astroStyles.text, { textAlign: 'center', fontStyle: 'italic', marginHorizontal: 20 }]}>
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
          )} */}

          <View style={astroStyles.tarotCard}>
  {pngBase64 && (
    <View style={astroStyles.imageShadowContainer}>
      <Image source={{ uri: pngBase64 }} style={astroStyles.chartImage} resizeMode="contain" />
    </View>
  )}

  {svgContent && !pngBase64 && (
    <WebView
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      onMessage={onWebViewMessage}
      style={{ height: 1, width: 1, opacity: 0 }}
    />
  )}

  <Text style={astroStyles.tarotText}>
    The stars kept moving since your birth. This is how the sky looked like that day.
  </Text>
</View>



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
