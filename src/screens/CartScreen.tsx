import { BookPrice } from '@/components/BookPrice';
import { CartItem } from '@/components/CartItem';
import { EmptyState } from '@/components/EmptyState';
import {
  selectClearCart,
  selectItems,
  selectRemoveItem,
  selectTotalPrice,
  selectUpdateQuantity,
  useCartStore,
} from '@/store/cart-store';
import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const items = useCartStore(selectItems);
  const updateQuantity = useCartStore(selectUpdateQuantity);
  const removeItem = useCartStore(selectRemoveItem);
  const totalPrice = useCartStore(selectTotalPrice);
  const clearCart = useCartStore(selectClearCart);

  const handleIncrement = (bookId: string, currentQty: number) => {
    updateQuantity(bookId, currentQty + 1);
  };

  const handleDecrement = (bookId: string, currentQty: number) => {
    updateQuantity(bookId, currentQty - 1);
  };

  const handleRemove = (bookId: string) => {
    removeItem(bookId);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleBrowse = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-brand-bg">
      <View style={{ flex: 1 }} className="px-4 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4 px-1">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.back()}
              className="bg-brand-surface w-9 h-9 rounded-full items-center justify-center border border-brand-border shadow-sm active:opacity-70"
              accessibilityLabel="Close cart"
            >
              <Text className="text-primary text-lg font-bold">×</Text>
            </Pressable>
            <View>
              <Text className="text-primary font-bold text-2xl font-serif">
                Shopping Cart
              </Text>
              <Text className="text-brand-text-muted text-xs font-semibold">
                {items.length === 0
                  ? 'Your cart is empty'
                  : `${items.length} unique book${items.length > 1 ? 's' : ''} added`}
              </Text>
            </View>
          </View>

          {items.length > 0 && (
            <Pressable
              onPress={clearCart}
              className="px-3 py-1.5 rounded-lg active:bg-brand-surface border border-brand-accent/20"
            >
              <Text className="text-brand-accent text-xs font-semibold">
                Clear All
              </Text>
            </Pressable>
          )}
        </View>

        {/* List of Cart Items */}
        {items.length === 0 ? (
          <View className="flex-1 justify-center pb-20">
            <EmptyState
              title="Your Cart is Empty"
              description="Browse our collection of books and add them to your cart to purchase."
              emoji="🛒"
              actionLabel="Browse Catalog"
              onAction={handleBrowse}
            />
          </View>
        ) : (
          <View className="flex-1 justify-between">
            <FlatList
              data={items}
              keyExtractor={(item) => item.book.id}
              contentContainerStyle={{ paddingBottom: 16 }}
              renderItem={({ item }) => (
                <CartItem
                  item={item}
                  onIncrement={() => handleIncrement(item.book.id, item.quantity)}
                  onDecrement={() => handleDecrement(item.book.id, item.quantity)}
                  onRemove={() => handleRemove(item.book.id)}
                />
              )}
            />

            {/* Total Area and Checkout CTA */}
            <View className="bg-brand-surface border-t border-brand-border p-4 -mx-4 pb-8 rounded-t-3xl shadow-lg">
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-brand-text font-semibold text-base">Total Price</Text>
                  <Text className="text-brand-text-muted text-[10px]">Taxes calculated at checkout</Text>
                </View>
                <BookPrice price={totalPrice} size="lg" />
              </View>

              <Pressable
                onPress={handleCheckout}
                className="w-full bg-primary py-4 rounded-2xl items-center justify-center shadow-md active:opacity-80 transition-all duration-200"
              >
                <Text className="text-white font-bold text-sm">
                  Proceed to Checkout
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
