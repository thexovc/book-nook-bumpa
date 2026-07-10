import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { CartItem as CartItemType } from '@/types/book';
import { BookPrice } from './BookPrice';

interface CartItemProps {
  item: CartItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = React.memo(({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const { book, quantity } = item;

  return (
    <View className="bg-brand-surface rounded-2xl border border-brand-border shadow-sm p-3 mb-4 flex-row items-center">
      {/* Thumbnail Cover */}
      <View className="w-[60px] h-[85px] bg-brand-bg rounded-lg overflow-hidden shadow-sm">
        {book.coverUrl ? (
          <Image
            source={{ uri: book.coverUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : (
          <View className="w-full h-full bg-brand-bg items-center justify-center p-1">
            <Text className="text-[8px] text-primary font-bold text-center">
              NO COVER
            </Text>
          </View>
        )}
      </View>

      {/* Book details */}
      <View className="flex-1 pl-4 pr-2">
        <Text className="text-brand-text font-semibold text-sm" numberOfLines={1}>
          {book.title}
        </Text>
        <Text className="text-brand-text-muted text-xs font-medium mt-0.5" numberOfLines={1}>
          by {book.authors.join(', ')}
        </Text>
        <BookPrice price={book.price} size="sm" className="mt-2" />
      </View>

      {/* Quantity Stepper & Remove Actions */}
      <View className="items-end gap-2.5">
        {/* Remove Button */}
        <Pressable
          onPress={onRemove}
          className="p-1 rounded-full active:bg-brand-accent/10"
          accessibilityLabel="Remove item"
        >
          {/* Trash Can Icon represented as a clean Unicode character '✕' or similar styled in coral */}
          <Text className="text-brand-accent text-sm font-semibold">✕</Text>
        </Pressable>

        {/* Stepper */}
        <View className="flex-row items-center bg-brand-bg border border-brand-border rounded-lg overflow-hidden">
          <Pressable
            onPress={onDecrement}
            className="px-3 py-1.5 active:bg-brand-surface"
            accessibilityLabel="Decrease quantity"
          >
            <Text className="text-brand-text font-bold text-xs">−</Text>
          </Pressable>
          
          <Text className="text-brand-text font-semibold text-xs px-2 min-w-[24px] text-center">
            {quantity}
          </Text>
          
          <Pressable
            onPress={onIncrement}
            className="px-3 py-1.5 active:bg-brand-surface"
            accessibilityLabel="Increase quantity"
          >
            <Text className="text-brand-text font-bold text-xs">+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
});

CartItem.displayName = 'CartItem';
