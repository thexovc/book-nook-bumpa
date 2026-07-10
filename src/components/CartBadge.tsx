import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useCartStore, selectTotalItems } from '@/store/cart-store';

export const CartBadge: React.FC = () => {
  const totalItems = useCartStore(selectTotalItems);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (totalItems > 0) {
      scale.value = withSequence(
        withSpring(1.4, { damping: 4, stiffness: 200 }),
        withSpring(1, { damping: 8, stiffness: 100 })
      );
    }
  }, [totalItems, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (totalItems === 0) return null;

  return (
    <Animated.View
      style={[styles.badge, animatedStyle]}
      className="bg-brand-accent items-center justify-center"
    >
      <Text className="text-white text-[10px] font-bold text-center">
        {totalItems > 99 ? '99+' : totalItems}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    zIndex: 10,
  },
});
