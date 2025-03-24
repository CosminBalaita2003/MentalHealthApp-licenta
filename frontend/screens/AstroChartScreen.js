import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, Alert, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { fetchNatalWheelChart, fetchPlanets, fetchHouses } from '../services/astroChartService';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import globalStyles from '../styles/globalStyles';

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
        console.error("❌ Eroare generală:", error.response?.data || error.message);
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
    <View style={globalStyles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[globalStyles.title, { marginLeft: 12 }]}>Your Natal Chart</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E8BCB9" style={{ flex: 1 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Chart */}
          {pngBase64 && (
            <Image
              source={{ uri: pngBase64 }}
              style={{ width: '90%', height: undefined, aspectRatio: 1, alignSelf: 'center', marginVertical: 20 }}
              resizeMode="contain"
            />
          )}

          {/* Hidden WebView to convert SVG */}
          {svgContent && !pngBase64 && (
            <WebView
              originWhitelist={['*']}
              source={{ html: htmlContent }}
              onMessage={onWebViewMessage}
              style={{ height: 1, width: 1, opacity: 0 }}
            />
          )}

          {/* Planets */}
          <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
            <Text style={[globalStyles.title, { fontSize: 18 }]}>🪐 Planets</Text>
            {planets.length === 0 ? (
              <Text style={globalStyles.text}>No planet data received.</Text>
            ) : (
              planets.map((p, index) => {
                const name = p.planet?.en || 'Unknown';
                const sign = p.zodiac_sign?.name?.en || 'Unknown sign';
                const degree = p.normDegree?.toFixed(2) || '?';
                const retro = p.isRetro?.toLowerCase() === 'true' ? ' (R)' : '';
              
                return (
                  <Text key={index} style={globalStyles.text}>
                    {name} is in {sign}{retro} at {degree}°
                  </Text>
                );
              })
              
              
              )}
            
            
          </View>

          {/* Houses */}
          <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
            <Text style={[globalStyles.title, { fontSize: 18 }]}>🏠 Houses</Text>
            {houses.length === 0 ? (
              <Text style={globalStyles.text}>No house data received.</Text>
            ) : (
              houses.map((h, index) => (
                <Text key={index} style={globalStyles.text}>
                  House {h.House}: {h.zodiac_sign?.name?.en} {h.degree?.toFixed(2)}°
                </Text>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
