import { AddToCartButton } from '@/components/AddToCartButton';
import { BookPrice } from '@/components/BookPrice';
import { ErrorState } from '@/components/ErrorState';
import { BookDetailsSkeleton } from '@/components/LoadingSkeleton';
import { RatingStars } from '@/components/RatingStars';
import { useAnimation } from '@/context/AnimationContext';
import { useBookDetails } from '@/hooks/use-book-details';
import { selectAddItem, selectUpdateQuantity, selectItemQuantity, useCartStore } from '@/store/cart-store';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { HeaderCartButton } from '@/components/HeaderCartButton';

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { book, loading, error, retry } = useBookDetails(id || '');

  const addItem = useCartStore(selectAddItem);
  const updateQuantity = useCartStore(selectUpdateQuantity);
  const bookQuantity = useCartStore(selectItemQuantity(book?.id || ''));
  const { triggerFlyToCart } = useAnimation();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleAddToCart = (startX: number, startY: number) => {
    if (!book) return;
    triggerFlyToCart(book.coverUrl, startX, startY);
    addItem(book);
  };

  if (loading) {
    return (
      <ScrollView style={{ flex: 1 }} className="bg-brand-bg pt-10">
        <Pressable onPress={handleBack} className="p-4 active:opacity-75">
          <Text className="text-primary text-2xl font-bold">←</Text>
        </Pressable>
        <BookDetailsSkeleton />
      </ScrollView>
    );
  }

  if (error || !book) {
    return (
      <View style={{ flex: 1 }} className="bg-brand-bg pt-10">
        <Pressable onPress={handleBack} className="p-4 active:opacity-75">
          <Text className="text-primary text-2xl font-bold">←</Text>
        </Pressable>
        <ErrorState message={error || 'Failed to fetch book data.'} onRetry={retry} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} className="bg-brand-bg">
      {/* Header Back Button & Cart */}
      <View className="pt-12 px-4 flex-row items-center justify-between">
        <Pressable
          onPress={handleBack}
          className="bg-brand-surface w-10 h-10 rounded-full items-center justify-center border border-brand-border shadow-sm active:opacity-70"
          accessibilityLabel="Go back"
        >
          <Text className="text-primary text-xl font-bold">←</Text>
        </Pressable>
        <HeaderCartButton />
      </View>

      <Animated.View entering={FadeIn.duration(300)} className="p-4 gap-6 pb-20">
        {/* Cover Image */}
        <View className="items-center">
          <View className="w-[180px] h-[260px] bg-brand-surface rounded-2xl overflow-hidden shadow-lg border border-brand-border">
            {book.coverUrl ? (
              <Image
                source={{ uri: book.coverUrl }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            ) : (
              <View className="w-full h-full bg-brand-bg items-center justify-center p-4">
                <Text className="text-primary font-bold text-center">
                  NO COVER AVAILABLE
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Title, Author, Rating */}
        <View className="items-center gap-2">
          <Text className="text-brand-text text-2xl font-bold text-center font-serif leading-8">
            {book.title}
          </Text>
          <Text className="text-brand-text-muted text-sm font-medium text-center">
            by {book.authors.join(', ')}
          </Text>
          <RatingStars rating={book.rating} count={book.ratingsCount} size="md" className="mt-1" />
        </View>

        <View className="h-[1px] bg-brand-text-muted/10 my-1" />

        {/* Pricing & Checkout CTA */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-brand-text-muted text-[10px] uppercase font-bold tracking-wider">Price</Text>
            <BookPrice price={book.price} originalPrice={book.price * 1.25} size="lg" className="mt-0.5" />
          </View>

          <View className="flex-1 max-w-[200px]">
            <AddToCartButton
              onPress={handleAddToCart}
              quantity={bookQuantity}
              onIncrement={() => addItem(book)}
              onDecrement={() => updateQuantity(book.id, bookQuantity - 1)}
            />
          </View>
        </View>

        <View className="h-[1px] bg-brand-text-muted/10 my-1" />

        {/* Description */}
        <View className="gap-2">
          <Text className="text-brand-text font-bold text-base font-serif">
            Book Description
          </Text>
          <Text className="text-brand-text-muted text-sm leading-6">
            {book.description}
          </Text>
        </View>

        {/* Subjects tags */}
        {book.subjects && book.subjects.length > 0 && (
          <View className="gap-2.5">
            <Text className="text-brand-text font-bold text-xs uppercase tracking-wider">
              Subjects & Genres
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {book.subjects.map((sub, idx) => (
                <View
                  key={idx}
                  className="bg-brand-surface border border-brand-border shadow-sm px-3 py-1.5 rounded-full"
                >
                  <Text className="text-brand-text-muted text-xs font-semibold">
                    {sub}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}
