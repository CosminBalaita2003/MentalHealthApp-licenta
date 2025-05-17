import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

export default function BreathingContainer({ children, style }) {
  const scale = useRef(new Animated.Value(1)).current;
  const shadow = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const loopAnimation = () => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.03,
              duration: 2000,
              useNativeDriver: false,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: false,
            }),
          ]),
          Animated.sequence([
            Animated.timing(shadow, {
              toValue: 0.4,
              duration: 2000,
              useNativeDriver: false, 
            }),
            Animated.timing(shadow, {
              toValue: 0.2,
              duration: 2000,
              useNativeDriver: false,
            }),
          ]),
        ])
      ).start();
    };

    loopAnimation();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [{ scale }],
          shadowOpacity: shadow,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1A38',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 40,
    shadowColor: '#E8BCB9',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 6,
  },
});
