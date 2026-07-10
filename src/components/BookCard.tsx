import { Book } from '@/types/book';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BookPrice } from './BookPrice';
import { RatingStars } from './RatingStars';

interface BookCardProps {
  book: Book;
  index?: number; // used for stagger delay
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const BookCard: React.FC<BookCardProps> = React.memo(({ book, index = 0 }) => {
  const scale = useSharedValue(1);

  const handlePress = () => {
    router.push(`/book/${book.id}`);
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 60, 400)).springify().damping(18).stiffness(120)}
      style={animatedStyle}
    >
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="bg-brand-surface rounded-2xl border border-brand-border shadow-sm flex-row p-3 mb-4"
      >
        {/* Cover Image */}
        <View className="w-[80px] h-[110px] bg-brand-bg rounded-lg overflow-hidden shadow-sm">
          {book.coverUrl ? (
            <Image
              source={{ uri: book.coverUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={300}
              cachePolicy="memory-disk"
            />
          ) : (
            <View className="w-full h-full bg-brand-bg items-center justify-center p-2">
              <Text className="text-[10px] text-primary font-bold text-center">
                NO COVER
              </Text>
            </View>
          )}
        </View>

        {/* Book details */}
        <View className="flex-1 pl-4 justify-between py-1">
          <View>
            <Text className="text-brand-text font-semibold text-base line-clamp-1" numberOfLines={1}>
              {book.title}
            </Text>
            <Text className="text-brand-text-muted text-xs font-medium mt-0.5 line-clamp-1" numberOfLines={1}>
              by {book.authors.join(', ')}
            </Text>
            <RatingStars rating={book.rating} count={book.ratingsCount} className="mt-1.5" />
          </View>

          <View className="flex-row items-center justify-between">
            <BookPrice price={book.price} originalPrice={book.price * 1.2} size="md" />
            <Text className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {book.publishYear ? book.publishYear : 'Recent'}
            </Text>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
});

BookCard.displayName = 'BookCard';
