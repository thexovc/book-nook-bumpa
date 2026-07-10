import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

export const SkeletonShimmer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 800 }),
        withTiming(0.4, { duration: 800 })
      ),
      -1, // infinite loop
      true // reverse
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle} className={className}>
      {children}
    </Animated.View>
  );
};

export const BookCardSkeleton: React.FC = () => {
  return (
    <SkeletonShimmer className="bg-brand-surface rounded-2xl p-3 mb-4 flex-row border border-brand-border/50 shadow-sm">
      {/* Cover placeholder */}
      <View className="w-[80px] h-[110px] bg-brand-text-muted/10 rounded-lg" />
      
      {/* Details placeholder */}
      <View className="flex-1 pl-4 justify-between py-1">
        <View className="gap-2">
          {/* Title bar */}
          <View className="w-[70%] h-4 bg-brand-text-muted/10 rounded" />
          {/* Author bar */}
          <View className="w-[45%] h-3 bg-brand-text-muted/10 rounded" />
          {/* Rating stars bar */}
          <View className="w-[30%] h-3 bg-brand-text-muted/10 rounded" />
        </View>
        
        <View className="flex-row items-center justify-between">
          {/* Price bar */}
          <View className="w-14 h-4 bg-brand-text-muted/10 rounded" />
          {/* Year badge bar */}
          <View className="w-10 h-3.5 bg-brand-text-muted/10 rounded-full" />
        </View>
      </View>
    </SkeletonShimmer>
  );
};

export const BookDetailsSkeleton: React.FC = () => {
  return (
    <SkeletonShimmer className="p-4 gap-6">
      {/* Cover Image Placeholder */}
      <View className="items-center">
        <View className="w-[180px] h-[260px] bg-brand-text-muted/10 rounded-2xl shadow-lg" />
      </View>
      
      {/* Meta Details Placeholder */}
      <View className="gap-3">
        <View className="w-[85%] h-7 bg-brand-text-muted/10 rounded self-center" />
        <View className="w-[50%] h-4 bg-brand-text-muted/10 rounded self-center" />
        <View className="w-[35%] h-4 bg-brand-text-muted/10 rounded self-center" />
      </View>
      
      <View className="h-[1px] bg-brand-text-muted/10 my-1" />
      
      {/* Price & Add to Cart Placeholder */}
      <View className="flex-row items-center justify-between">
        <View className="w-24 h-7 bg-brand-text-muted/10 rounded" />
        <View className="w-36 h-12 bg-brand-text-muted/10 rounded-2xl" />
      </View>
      
      <View className="h-[1px] bg-brand-text-muted/10 my-1" />
      
      {/* Description Placeholder */}
      <View className="gap-2.5">
        <View className="w-[30%] h-4 bg-brand-text-muted/10 rounded" />
        <View className="w-full h-3 bg-brand-text-muted/10 rounded" />
        <View className="w-[95%] h-3 bg-brand-text-muted/10 rounded" />
        <View className="w-[98%] h-3 bg-brand-text-muted/10 rounded" />
        <View className="w-[80%] h-3 bg-brand-text-muted/10 rounded" />
      </View>
    </SkeletonShimmer>
  );
};
