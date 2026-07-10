import React, { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface AddToCartButtonProps {
  onPress: (startX: number, startY: number) => void;
  quantity?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  onPress,
  quantity = 0,
  onIncrement,
  onDecrement,
  className = '',
}) => {
  const containerRef = useRef<View>(null);
  const [added, setAdded] = useState(false);

  const scale = useSharedValue(1);

  const handlePress = () => {
    if (added) return;

    // Scale animation
    scale.value = withSequence(
      withTiming(0.92, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );

    let measured = false;

    // Measure positions on screen
    if (containerRef.current) {
      containerRef.current.measure((x, y, width, height, pageX, pageY) => {
        measured = true;
        if (pageX !== undefined && pageY !== undefined) {
          // start animation from middle of button
          onPress(pageX + width / 2, pageY + height / 2);
        } else {
          onPress(0, 0); // fallback
        }

        // Show "Added!" status for 1.5 seconds
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      });
    }

    // Safety fallback: if measure fails to resolve (common on some platforms/web),
    // still add the item to the cart after 50ms so core functionality works.
    setTimeout(() => {
      if (!measured) {
        onPress(0, 0);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }
    }, 50);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (quantity > 0) {
    return (
      <View className="flex-row items-center border border-brand-border bg-brand-surface rounded-2xl shadow-sm overflow-hidden h-[52px]">
        <Pressable
          onPress={onDecrement}
          className="w-12 h-full items-center justify-center bg-brand-bg active:bg-brand-border/40"
          accessibilityLabel="Decrease quantity"
        >
          <Text className="text-primary font-bold text-lg">-</Text>
        </Pressable>
        
        <View className="flex-1 items-center justify-center">
          <Text className="text-primary font-bold text-xs">
            {quantity} {quantity === 1 ? 'Book' : 'Books'} in Cart
          </Text>
        </View>

        <Pressable
          onPress={onIncrement}
          className="w-12 h-full items-center justify-center bg-brand-bg active:bg-brand-border/40"
          accessibilityLabel="Increase quantity"
        >
          <Text className="text-primary font-bold text-lg">+</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Animated.View ref={containerRef} style={animatedStyle} className={className} collapsable={false}>
      <Pressable
        onPress={handlePress}
        className={`w-full py-4 rounded-2xl items-center justify-center shadow-md active:opacity-80 transition-all duration-200 ${added
            ? 'bg-emerald-600'
            : 'bg-primary'
          }`}
      >
        <Text className="font-bold text-sm text-center text-white">
          {added ? '✓ Added to Cart!' : 'Add to Shopping Cart'}
        </Text>
      </Pressable>
    </Animated.View>
  );
};
