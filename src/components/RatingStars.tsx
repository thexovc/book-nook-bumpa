import React from 'react';
import { Text, View } from 'react-native';

interface RatingStarsProps {
  rating: number;
  count?: number;
  showCount?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count = 0,
  showCount = true,
  size = 'sm',
  className = '',
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starSizeClass = size === 'sm' ? 'text-xs' : 'text-base';
  const textContainerClass = size === 'sm' ? 'text-xs ml-1' : 'text-sm ml-2';

  return (
    <View className={`flex-row items-center ${className}`}>
      {/* Full Stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Text key={`full-${i}`} className={`text-primary ${starSizeClass}`}>
          ★
        </Text>
      ))}
      
      {/* Half Star (represented as a filled star in primary color, or a Unicode half star if supported, let's keep it simple with ★ but lighter, or just a Unicode half star if we want, or a filled star. Since Unicode doesn't have a universal half star that renders perfectly everywhere, a filled star works or we can use a custom glyph or color. Let's use a ★ with different opacity if we want, or a ✦. Let's do ★ with opacity.) */}
      {hasHalfStar && (
        <Text className={`text-primary/70 ${starSizeClass}`}>
          ★
        </Text>
      )}
      
      {/* Empty Stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Text key={`empty-${i}`} className={`text-brand-text-muted/40 ${starSizeClass}`}>
          ☆
        </Text>
      ))}

      {showCount && (
        <Text className={`text-brand-text-muted ${textContainerClass}`}>
          ({count})
        </Text>
      )}
    </View>
  );
};
