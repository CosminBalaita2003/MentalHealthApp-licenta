// components/MorphingImage.js
import React, { useRef, useEffect, useState } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";

const MorphingImage = ({
  fromUri,
  toUri,
  trigger,
  size = 250,
  duration = 1000,    // a bit longer for smoother feel
}) => {
  // animated values
  const fadeOut  = useRef(new Animated.Value(1)).current;
  const fadeIn   = useRef(new Animated.Value(0)).current;
  const scaleOut = useRef(new Animated.Value(1)).current;
  const scaleIn  = useRef(new Animated.Value(0.9)).current;

  // track images
  const [prevImage, setPrevImage]     = useState(fromUri);
  const [currentImage, setCurrentImage] = useState(toUri);

  useEffect(() => {
    // update images
    setPrevImage(currentImage);
    setCurrentImage(toUri);

    // reset animated values
    fadeOut.setValue(1);
    fadeIn.setValue(0);
    scaleOut.setValue(1);
    scaleIn.setValue(0.9);

    // run in parallel:
    Animated.parallel([
      // fade out the old image
      Animated.timing(fadeOut, {
        toValue: 0,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      // fade in the new image
      Animated.timing(fadeIn, {
        toValue: 1,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      // slight zoom-out of the old image
      Animated.timing(scaleOut, {
        toValue: 1.2,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      // zoom-in of the new image back to normal
      Animated.timing(scaleIn, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [trigger, toUri]);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size/2 }]}>
      {prevImage && (
        <Animated.Image
          source={{ uri: prevImage }}
          style={[
            styles.image,
            { opacity: fadeOut, transform: [{ scale: scaleOut }] },
          ]}
          resizeMode="cover"
        />
      )}
      {currentImage && (
        <Animated.Image
          source={{ uri: currentImage }}
          style={[
            styles.image,
            { opacity: fadeIn, transform: [{ scale: scaleIn }] },
          ]}
          resizeMode="cover"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
    backgroundColor: "transparent",
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

export default MorphingImage;
