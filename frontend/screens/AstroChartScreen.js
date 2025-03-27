import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, Alert, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { fetchNatalWheelChart, fetchPlanets, fetchHouses } from '../services/astroChartService';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import astroStyles from '../styles/astroChartStyles';

export default function AstroChartScreen({ route, navigation }) {
  const { user } = route.params;
  const [svgContent, setSvgContent] = useState(null);
  const [pngBase64, setPngBase64] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planets, setPlanets] = useState([]);
  const [houses, setHouses] = useState([]);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const chartResult = await fetchNatalWheelChart(user);
        const chartUrl = chartResult?.output;

        if (!chartUrl) {
          Alert.alert("Eroare", "Nu s-a putut obține link-ul către chart.");
          return;
        }

        const svgRes = await axios.get(chartUrl);
        setSvgContent(svgRes.data);

        // 👇 Delay între requesturi
        await sleep(1000);

        const planetsResult = await fetchPlanets(user);
        console.log("Planets:", planetsResult?.output);
        setPlanets(planetsResult?.output || []);

        await sleep(1000);

        const housesResult = await fetchHouses(user);
        setHouses(housesResult?.output?.Houses || []);

      } catch (error) {
        console.error(" Eroare generală:", error.response?.data || error.message);
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
        <ActivityIndicator size="large" color="#E8BCB9" style={{ flex: 1 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Chart Image */}
          {pngBase64 && (
            <Image source={{ uri: pngBase64 }} style={astroStyles.chartImage} resizeMode="contain" />
          )}

          {/* WebView for PNG conversion */}
          {svgContent && !pngBase64 && (
            <WebView
              originWhitelist={['*']}
              source={{ html: htmlContent }}
              onMessage={onWebViewMessage}
              style={{ height: 1, width: 1, opacity: 0 }}
            />
          )}

          {/* Planets */}
          <View style={astroStyles.sectionContainer}>
            <View style={astroStyles.sectionHeader}>
              <Ionicons name="planet" size={20} color="#fff" style={astroStyles.sectionIcon} />
              <Text style={astroStyles.sectionTitle}>Planets</Text>
            </View>
            <Text style={astroStyles.explanation}>
              The planets represent fundamental psychological functions. For example, the Sun reflects your ego, the Moon your emotions, and Mercury your communication style.
            </Text>
            {planets.length === 0 ? (
              <Text style={astroStyles.text}>No planet data received.</Text>
            ) : (
              planets.map((p, index) => {
                const name = p.planet?.en || 'Unknown';
                const sign = p.zodiac_sign?.name?.en || 'Unknown sign';
                const degree = p.normDegree?.toFixed(2) || '?';
                const retro = p.isRetro?.toLowerCase() === 'true' ? ' (R)' : '';
                return (
                  <Text key={index} style={astroStyles.text}>
                    <Text style={{ fontWeight: 'bold' }}>{name}</Text> is in {sign}{retro} at {degree}°
                  </Text>
                );
              })
            )}
          </View>

          {/* Houses */}
          <View style={astroStyles.sectionContainer}>
            <View style={astroStyles.sectionHeader}>
              <Ionicons name="home" size={20} color="#fff" style={astroStyles.sectionIcon} />
              <Text style={astroStyles.sectionTitle}>Houses</Text>
            </View>
            <Text style={astroStyles.explanation}>
              Houses describe "where" in your life the planetary energy manifests. For example, House 1 relates to identity, House 7 to relationships, and House 10 to career.
            </Text>
            {houses.length === 0 ? (
              <Text style={astroStyles.text}>No house data received.</Text>
            ) : (
              houses.map((h, index) => (
                <Text key={index} style={astroStyles.text}>
                  <Text style={{ fontWeight: 'bold' }}>House {h.House}</Text>: {h.zodiac_sign?.name?.en} {h.degree?.toFixed(2)}°
                </Text>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>


  );
}
