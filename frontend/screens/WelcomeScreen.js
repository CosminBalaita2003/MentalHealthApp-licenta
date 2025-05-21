// import React, { useRef, useEffect } from 'react'
// import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from 'react-native'
// import theme from '../styles/theme'
// import styles from '../styles/welcomeStyles'  // păstrăm restul stilurilor

// const { width } = Dimensions.get('window')
// const LOGO_SIZE = 200

// export default function WelcomeScreen({ navigation }) {
//   const maskAnim = useRef(new Animated.Value(0)).current

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(maskAnim, {
//           toValue: 1,
//           duration: 5000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true
//         }),
//         Animated.timing(maskAnim, {
//           toValue: 0,
//           duration: 5000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true
//         })
//       ])
//     ).start()
//   }, [maskAnim])

//   // Traducem masca pe axa Y de la 0 (jos) la -LOGO_SIZE (sus)
//   const translateY = maskAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -LOGO_SIZE]
//   })

//   return (
//     <View style={styles.container}>
//       {/* Containerul logo + mască */}
//       <View style={localStyles.logoContainer}>
//         <Image source={require('../assets/logo-white.png')} style={localStyles.logo} />
//         <Animated.View
//           style={[
//             localStyles.mask,
//             { transform: [{ translateY }] }
//           ]}
//         />
//       </View>

//       <Text style={styles.title}>MindWell</Text>
//       <Text style={styles.subtitle}>Welcome! Let's take care of your mental wellbeing.</Text>

//       <TouchableOpacity
//         style={[styles.button, { backgroundColor: theme.colors.semiaccent }]}
//         onPress={() => navigation.navigate('LoginScreen')}
//       >
//         <Text style={styles.buttonText}>Log in</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => navigation.navigate('RegisterScreen')}
//       >
//         <Text style={styles.buttonText}>Register</Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

// const localStyles = StyleSheet.create({
//   logoContainer: {
//     width: LOGO_SIZE,
//     height: LOGO_SIZE,
//     marginBottom: 0,
//     overflow: 'hidden'
//   },
//   logo: {
//     width: LOGO_SIZE,
//     height: LOGO_SIZE,
//     resizeMode: 'contain'
//   },
//   mask: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     width: LOGO_SIZE,
//     height: LOGO_SIZE,
//     backgroundColor: theme.colors.background,  // același cu fundalul tău
//     opacity: 0.8,
//   }
// })

import React, { useRef, useEffect } from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from 'react-native'
import theme from '../styles/theme'
import styles from '../styles/welcomeStyles'

const { width } = Dimensions.get('window')
const LOGO_SIZE = 200

export default function WelcomeScreen({ navigation }) {
  const fillAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fillAnim, {
          toValue: 1,
          duration: 7500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false, // animăm înălțimea, deci nu cu native driver
        }),
        Animated.delay(1000),
        Animated.timing(fillAnim, {
          toValue: 0,
          duration: 7500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start()
  }, [fillAnim])

  // Înălțimea apei de la 0 la LOGO_SIZE
  const waterHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [LOGO_SIZE, 0], // inversat pentru a umple de sus în jos
  })

  return (
    <View style={styles.container}>
      <View style={localStyles.logoContainer}>
        <Image
          source={require('../assets/logo-white.png')}
          style={localStyles.logo}
        />
        {/* “Apă” peste logo */}
        <Animated.View
          style={[
            localStyles.water,
            { height: waterHeight }
          ]}
        />
      </View>

      <Text style={styles.title}>MindWell</Text>
      <Text style={styles.subtitle}>
        Welcome! Let's take care of your mental wellbeing.
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.semiaccent }]}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  )
}

const localStyles = StyleSheet.create({
  logoContainer: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    resizeMode: 'contain',
  },
  water: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    top: 0,
    width: LOGO_SIZE,
   backgroundColor: theme.colors.background,  // același cu fundalul tău
    opacity: 0.95,
   borderTopLeftRadius: LOGO_SIZE / 4,
    borderTopRightRadius: LOGO_SIZE / 4,
    borderBottomLeftRadius: LOGO_SIZE / 4,
    borderBottomRightRadius: LOGO_SIZE / 2,
  },
})
