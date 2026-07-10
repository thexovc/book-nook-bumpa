import React from 'react';
import { Text, View } from 'react-native';

interface BookPriceProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BookPrice: React.FC<BookPriceProps> = ({
  price,
  originalPrice,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-sm font-semibold text-primary',
    md: 'text-base font-bold text-primary',
    lg: 'text-xl font-extrabold text-primary',
  };

  const origSizeClasses = {
    sm: 'text-xs text-brand-text-muted line-through ml-1.5',
    md: 'text-xs text-brand-text-muted line-through ml-2',
    lg: 'text-sm text-brand-text-muted line-through ml-2.5',
  };

  return (
    <View className={`flex-row items-center ${className}`}>
      <Text className={sizeClasses[size]}>${price.toFixed(2)}</Text>
      {originalPrice && originalPrice > price && (
        <Text className={origSizeClasses[size]}>
          ${originalPrice.toFixed(2)}
        </Text>
      )}
    </View>
  );
};
