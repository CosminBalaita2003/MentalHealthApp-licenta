import React from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { View } from 'react-native';

const { width } = Dimensions.get('window');

export default function SwipeableDeck({ data, renderCard }) {
  const index = useSharedValue(0);
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > width * 0.3) {
        const toLeft = event.translationX < 0;
        translateX.value = withSpring(toLeft ? -width : width, {}, () => {
          runOnJS(() => {
            index.value = Math.min(index.value + 1, data.length - 1);
            translateX.value = 0;
          })();
        });
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ height: 300 }}>
      {data.slice(index.value, index.value + 1).map((item, i) => (
        <PanGestureHandler key={i} onGestureEvent={gestureHandler}>
          <Animated.View style={[animatedStyle]}>
            {renderCard(item, index.value)}
          </Animated.View>
        </PanGestureHandler>
      ))}
    </View>
  );
}
