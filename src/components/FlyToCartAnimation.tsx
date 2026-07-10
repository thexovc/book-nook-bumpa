import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useAnimation } from '@/context/AnimationContext';

const FlyingItem: React.FC<{
  id: string;
  coverUrl: string | null;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  onComplete: (id: string) => void;
}> = ({ id, coverUrl, startX, startY, endX, endY, onComplete }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 600 }, (finished) => {
      if (finished) {
        runOnJS(onComplete)(id);
      }
    });
  }, [id, endX, endY, startX, startY, progress, onComplete]);

  const animatedStyle = useAnimatedStyle(() => {
    const t = progress.value;
    // Calculate arc position
    const x = startX + (endX - startX) * t;
    
    // Curved trajectory (arc going upwards)
    const arcHeight = 150;
    const yParabola = 1 - 4 * Math.pow(t - 0.5, 2);
    const y = startY + (endY - startY) * t - arcHeight * Math.max(0, yParabola);
    
    const scale = 1.2 - t * 0.9; // start slightly larger, shrink to 0.3
    const opacity = 1 - t * 0.85; // fade out

    return {
      transform: [
        { translateX: x - 25 }, // half of image width (50 / 2)
        { translateY: y - 35 }, // half of image height (70 / 2)
        { scale },
      ],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.flyingImageContainer, animatedStyle]}>
      {coverUrl ? (
        <Image source={{ uri: coverUrl }} style={styles.image} contentFit="cover" />
      ) : (
        <View style={styles.placeholder} />
      )}
    </Animated.View>
  );
};

export const FlyToCartAnimation: React.FC = () => {
  const { activeAnimations, cartIconPosition, removeAnimation } = useAnimation();

  if (!cartIconPosition || activeAnimations.length === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {activeAnimations.map((anim) => (
        <FlyingItem
          key={anim.id}
          id={anim.id}
          coverUrl={anim.coverUrl}
          startX={anim.startX}
          startY={anim.startY}
          endX={cartIconPosition.x}
          endY={cartIconPosition.y}
          onComplete={removeAnimation}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  flyingImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: 70,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0F172A', // primary color
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 9999,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E2E8F0',
  },
});
