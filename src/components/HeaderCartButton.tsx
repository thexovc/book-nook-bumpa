import React, { useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useCartStore, selectTotalItems } from '@/store/cart-store';
import { useAnimation } from '@/context/AnimationContext';

export const HeaderCartButton: React.FC = () => {
  const totalItems = useCartStore(selectTotalItems);
  const { setCartIconPosition } = useAnimation();
  const ref = useRef<View>(null);

  const handlePress = () => {
    router.push('/cart');
  };

  const handleLayout = () => {
    if (ref.current) {
      ref.current.measure((x, y, width, height, pageX, pageY) => {
        if (pageX !== undefined && pageY !== undefined) {
          setCartIconPosition({
            x: pageX + width / 2,
            y: pageY + height / 2,
          });
        }
      });
    }
  };

  return (
    <View ref={ref} onLayout={handleLayout} collapsable={false}>
      <Pressable
        onPress={handlePress}
        className="bg-brand-surface w-10 h-10 rounded-full items-center justify-center border border-brand-border shadow-sm active:opacity-70 relative"
        accessibilityLabel="View Cart"
      >
        <Text className="text-base">🛒</Text>

        {totalItems > 0 && (
          <View className="absolute -top-1 -right-1 bg-brand-accent min-w-[16px] h-4 rounded-full items-center justify-center px-1">
            <Text className="text-white text-[9px] font-bold">
              {totalItems > 99 ? '99+' : totalItems}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};
