import React, { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";

const PARTICLE_COUNT = 25;
const RADIUS = 100;

const generateParticle = () => ({
  x: Math.random() * (2 * RADIUS) - RADIUS,
  y: Math.random() * (2 * RADIUS) - RADIUS,
  dx: (Math.random() - 0.5) * 1,
  dy: (Math.random() - 0.5) * 1,
  radius: 2 + Math.random() * 2,
  opacity: new Animated.Value(0),
  fadingOut: false,
});

const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  // Inițializare particule (fără animație) la mount
  useEffect(() => {
    const initialParticles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * (2 * RADIUS) - RADIUS,
      y: Math.random() * (2 * RADIUS) - RADIUS,
      dx: (Math.random() - 0.5) * 1,
      dy: (Math.random() - 0.5) * 1,
      radius: 2 + Math.random() * 2,
      opacity: new Animated.Value(0),
      fadingOut: false,
    }));

    setParticles(initialParticles);
  }, []);

  // fade in la toate după ce sunt create
  useEffect(() => {
    if (particles.length === 0) return;

    particles.forEach((p) => {
      Animated.timing(p.opacity, {
        toValue: 0.9,
        duration: 500,
        useNativeDriver: false,
      }).start();
    });
  }, [particles]);

  // animația de mișcare și regenerare
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prevParticles) => {
        return prevParticles.map((p, i) => {
          if (p.fadingOut) return p;

          let newX = p.x + p.dx;
          let newY = p.y + p.dy;

          if (Math.sqrt(newX * newX + newY * newY) > RADIUS) {
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: false,
            }).start(() => {
              const newParticle = {
                x: Math.random() * (2 * RADIUS) - RADIUS,
                y: Math.random() * (2 * RADIUS) - RADIUS,
                dx: (Math.random() - 0.5) * 1,
                dy: (Math.random() - 0.5) * 1,
                radius: 2 + Math.random() * 2,
                opacity: new Animated.Value(0),
                fadingOut: false,
              };

              Animated.timing(newParticle.opacity, {
                toValue: 0.9,
                duration: 500,
                useNativeDriver: false,
              }).start();

              setParticles((curr) => {
                const copy = [...curr];
                copy[i] = newParticle;
                return copy;
              });
            });

            return { ...p, fadingOut: true };
          }

          return { ...p, x: newX, y: newY };
        });
      });
    }, 40);

    return () => clearInterval(interval);
  }, [particles]);

  return (
    <Svg height={RADIUS * 2} width={RADIUS * 2}>
      {particles.map((p, index) => (
        <AnimatedCircle
          key={index}
          cx={RADIUS + p.x}
          cy={RADIUS + p.y}
          r={p.radius}
          fill="white"
          opacity={p.opacity}
        />
      ))}
    </Svg>
  );
};


const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default FloatingParticles;
