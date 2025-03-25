import React, { useEffect, useRef, useState } from "react";
import { View, Animated, StyleSheet, Image } from "react-native";

const MorphingImage = ({ fromUri, toUri, trigger }) => {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  const [prevImage, setPrevImage] = useState(fromUri);
  const [currentImage, setCurrentImage] = useState(toUri);

  useEffect(() => {
    // Update imagini
    setPrevImage(currentImage);
    setCurrentImage(toUri);

    // Reset animare
    fadeIn.setValue(0);
    fadeOut.setValue(1);

    Animated.parallel([
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [trigger, toUri]);

  return (
    <View style={styles.container}>
      {prevImage && (
        <Animated.Image
          source={{ uri: prevImage }}
          style={[
            styles.image,
            {
              opacity: fadeOut,
              transform: [
                {
                  scale: fadeOut.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1.1, 1], // zoom out
                  }),
                },
              ],
            },
          ]}
          resizeMode="cover"
        />
      )}

      {currentImage && (
        <Animated.Image
          source={{ uri: currentImage }}
          style={[
            styles.image,
            {
              opacity: fadeIn,
              transform: [
                {
                  scale: fadeIn.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1], // zoom in
                  }),
                },
              ],
            },
          ]}
          resizeMode="cover"
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: 200,
    height: 200,
    position: "absolute",
  },
});

export default MorphingImage;
