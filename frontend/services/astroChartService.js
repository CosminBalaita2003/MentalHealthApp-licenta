import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import tzlookup from "tz-lookup";
import moment from "moment-timezone";
import { API_URL } from "@env"; // URL-ul backend-ului tău

const getAstroPayload = async (profile) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    console.log(" No token found. Cannot fetch city data.");
    return null;
  }

  const cityResponse = await axios.get(`${API_URL}/api/city/${profile.cityId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const city = cityResponse.data;
  const latitude = parseFloat(city?.lat);
  const longitude = parseFloat(city?.lon);

  const timezoneName = tzlookup(latitude, longitude);
  const timezoneOffset = moment.tz(timezoneName).utcOffset() / 60;

  const dob = new Date(profile.dateOfBirth);
  const [hours, minutes, seconds] = profile.timeOfBirth
    ? profile.timeOfBirth.split(':').map(Number)
    : [12, 0, 0]; // fallback la 12:00 PM

  const basePayload = {
    year: dob.getFullYear(),
    month: dob.getMonth() + 1,
    date: dob.getDate(),
    hours,
    minutes,
    seconds,
    latitude,
    longitude,
    timezone: timezoneOffset,
  };

  return { basePayload, token };
};

// 🔮 1. Fetch natal wheel chart
export const fetchNatalWheelChart = async (profile) => {
  try {
    const result = await getAstroPayload(profile);
    if (!result) return null;

    const { basePayload } = result;

    const payload = {
      ...basePayload,
      config: {
        observation_point: "topocentric",
        ayanamsha: "tropical",
        house_system: "Placidus",
        language: "en",
        exclude_planets: [],
        allowed_aspects: [
          "Conjunction", "Opposition", "Trine", "Square", "Sextile",
          "Semi-Sextile", "Quintile", "Septile", "Octile", "Novile",
          "Quincunx", "Sesquiquadrate"
        ],
        aspect_line_colors: {
          "Conjunction": "#558B6E",
          "Opposition": "#88A09E",
          "Square": "#704C5E",
          "Trine": "#B88C9E",
          "Sextile": "#F1C8DB",
          "Semi-Sextile": "#A799B7",
          "Quintile": "#9888A5",
          "Septile": "#776472",
          "Octile": "#445552",
          "Novile": "#294D4A",
          "Quincunx": "#49306B",
          "Sesquiquadrate": "#E1CDB5"
        },
        wheel_chart_colors: {
          zodiac_sign_background_color: "#303036",
          chart_background_color: "#303036",
          zodiac_signs_text_color: "#FFFFFF",
          dotted_line_color: "#FFFAFF",
          planets_icon_color: "#FFFAFF"
        },
        orb_values: {
          Conjunction: 3,
          Opposition: 5,
          Square: 5,
          Trine: 5,
          Sextile: 5,
          "Semi-Sextile": 5,
          Quintile: 5,
          Septile: 5,
          Octile: 5,
          Novile: 5,
          Quincunx: 5,
          Sesquiquadrate: 5
        }
      }
    };

    const astroResponse = await axios.post(
      "https://json.apiastro.com/western/natal-wheel-chart",
      payload,
      {
        headers: {
          // 'x-api-key': 'rdB80hPQKM7BHCm1RfwDr6kZbNQgnxbp9HVuzZqc',
          'x-api-key': 'SqD8LbGWle8MjQzMRAB5w6sWhJepbC44cRzDcXke',
          'Content-Type': 'application/json',
        }
      }
    );

    return astroResponse.data;
  } catch (error) {
    console.error(" Error fetching natal chart:", error.response?.data || error.message);
    return null;
  }
};

// 🪐 2. Fetch planets
export const fetchPlanets = async (profile) => {
  try {
    const result = await getAstroPayload(profile);
    if (!result) return null;

    const { basePayload } = result;

    const payload = {
      ...basePayload,
      config: {
        observation_point: "topocentric",
        ayanamsha: "tropical",
        language: "en"
      }
    };

    const response = await axios.post(
      "https://json.freeastrologyapi.com/western/planets",
      payload,
      {
        headers: {
          // 'x-api-key': 'rdB80hPQKM7BHCm1RfwDr6kZbNQgnxbp9HVuzZqc',
          'x-api-key': 'SqD8LbGWle8MjQzMRAB5w6sWhJepbC44cRzDcXke',
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(" Error fetching planets:", error.response?.data || error.message);
    return null;
  }
};

// 🏠 3. Fetch houses
export const fetchHouses = async (profile) => {
  try {
    const result = await getAstroPayload(profile);
    if (!result) return null;

    const { basePayload } = result;

    const payload = {
      ...basePayload,
      config: {
        observation_point: "topocentric",
        ayanamsha: "tropical",
        house_system: "Placidus",
        language: "en"
      }
    };

    const response = await axios.post(
      "https://json.freeastrologyapi.com/western/houses",
      payload,
      {
        headers: {
         'x-api-key': 'rdB80hPQKM7BHCm1RfwDr6kZbNQgnxbp9HVuzZqc',
        //  'x-api-key': 'SqD8LbGWle8MjQzMRAB5w6sWhJepbC44cRzDcXke',
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(" Error fetching houses:", error.response?.data || error.message);
    return null;
  }
};
export const saveNatalChart = async (svgContent, planets, houses) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userString = await AsyncStorage.getItem("user");

    if (!token || !userString) {
      console.warn("No token or user found.");
      return;
    }

    const user = JSON.parse(userString);

    const simplifiedPlanets = planets.map(p => ({
      planet: p.planet?.en,
      zodiacSign: p.zodiac_sign?.name?.en,
    }));

    const simplifiedHouses = houses.map(h => ({
      house: h.House,
      zodiacSign: h.zodiac_sign?.name?.en,
    }));

    const response = await axios.post(
      `${API_URL}/api/NatalChart`,
      {
        chartSvg: svgContent,
        planetsJson: JSON.stringify(simplifiedPlanets),
        housesJson: JSON.stringify(simplifiedHouses),
        userId: user.id // acum merge corect ✅
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Natal chart saved:", response.status);
  } catch (error) {
    console.error("❌ Error saving natal chart:", error.response?.data || error.message);
  }
};
