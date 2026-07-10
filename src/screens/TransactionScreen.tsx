import { BookPrice } from '@/components/BookPrice';
import { selectOrders, usePurchasesStore } from '@/store/purchases-store';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orders = usePurchasesStore(selectOrders);

  const order = orders.find((o) => o.orderId === id);

  const handleBack = () => {
    router.back();
  };

  const handleOpenReader = (bookId: string) => {
    router.push(`/reader/${bookId}`);
  };

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="bg-brand-bg justify-center items-center p-6">
        <Text className="text-brand-text font-bold text-lg mb-2 font-serif">Order Not Found</Text>
        <Text className="text-brand-text-muted text-xs text-center mb-6">
          We couldn't retrieve the details for order reference {id}.
        </Text>
        <Pressable
          onPress={handleBack}
          className="bg-primary px-6 py-3 rounded-xl shadow-sm"
        >
          <Text className="text-white font-bold text-xs">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Calculate pricing values deterministically based on original checkout logic
  const subtotal = order.totalPrice / 1.075; // close enough mock reverse
  const tax = subtotal * 0.075;
  const shipping = subtotal > 35 ? 0 : 3.99;
  const total = order.totalPrice;

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-brand-bg">
      {/* Header */}
      <View className="pt-4 px-4 flex-row items-center justify-between mb-4">
        <Pressable
          onPress={handleBack}
          className="bg-brand-surface w-10 h-10 rounded-full items-center justify-center border border-brand-border shadow-sm active:opacity-70"
          accessibilityLabel="Go back"
        >
          <Text className="text-primary text-xl font-bold">←</Text>
        </Pressable>
        <Text className="text-brand-text font-bold text-lg font-serif">Receipt Details</Text>
        <View className="bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full">
          <Text className="text-emerald-700 text-[10px] font-bold uppercase">Settled</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-4 gap-6">
          {/* Receipt Header Card */}
          <View className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-sm gap-4 items-center">
            <Text className="text-3xl text-emerald-500 font-bold">✓</Text>

            <View className="items-center">
              <Text className="text-brand-text font-bold text-lg font-serif">
                Payment Confirmed
              </Text>
              <Text className="text-brand-text-muted text-[10px] mt-0.5">
                Order ID: {order.orderId}
              </Text>
            </View>

            <View className="w-full h-[1px] bg-brand-border/60" />

            <View className="w-full gap-2">
              <View className="flex-row justify-between">
                <Text className="text-brand-text-muted text-[11px]">
                  Transaction Date
                </Text>
                <Text className="text-brand-text font-semibold text-[11px]">
                  {order.date}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-brand-text-muted text-[11px]">
                  Payment Method
                </Text>
                <Text className="text-brand-text font-semibold text-[11px]">
                  Mock Card (Settled)
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-brand-text-muted text-[11px]">
                  Order Type
                </Text>
                <Text className="text-brand-text font-semibold text-[11px]">
                  Instant Access Digital Copy
                </Text>
              </View>
            </View>
          </View>

          {/* Purchased Items */}
          <View>
            <Text className="text-brand-text font-bold text-xs uppercase tracking-wider px-1 mb-3">
              Items Purchased
            </Text>

            <View className="gap-3">
              {order.items.map((cartItem) => (
                <View
                  key={cartItem.book.id}
                  className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex-row items-center gap-3 shadow-sm"
                >
                  {cartItem.book.coverUrl ? (
                    <Image
                      source={{ uri: cartItem.book.coverUrl }}
                      className="w-12 h-16 bg-brand-bg rounded-lg"
                      contentFit="cover"
                    />
                  ) : (
                    <View className="w-12 h-16 bg-brand-border rounded-lg items-center justify-center">
                      <Text className="text-[10px] text-brand-text-muted">📚</Text>
                    </View>
                  )}

                  <View className="flex-1">
                    <Text
                      className="text-brand-text font-bold text-xs"
                      numberOfLines={1}
                    >
                      {cartItem.book.title}
                    </Text>

                    <Text
                      className="text-brand-text-muted text-[9px] mt-0.5"
                      numberOfLines={1}
                    >
                      by {cartItem.book.authors.join(", ")}
                    </Text>

                    <Text className="text-brand-text font-semibold text-[9px] mt-1 bg-brand-bg px-2 py-0.5 rounded self-start">
                      Qty: {cartItem.quantity}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => handleOpenReader(cartItem.book.id)}
                    className="bg-primary px-3 py-2 rounded-xl active:opacity-85 shadow-sm"
                  >
                    <Text className="text-white font-bold text-[10px]">
                      Read Book
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          {/* Invoice Summary */}
          <View className="bg-brand-surface border border-brand-border rounded-2xl p-4 gap-3 shadow-sm">
            <Text className="text-brand-text font-bold text-xs uppercase tracking-wider font-serif">
              Invoice Breakdown
            </Text>

            <View className="gap-2 mt-1">
              <View className="flex-row justify-between">
                <Text className="text-brand-text-muted text-[11px]">
                  Items Subtotal
                </Text>
                <Text className="text-brand-text text-[11px]">
                  ${subtotal.toFixed(2)}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-brand-text-muted text-[11px]">
                  Sales Tax (7.5%)
                </Text>
                <Text className="text-brand-text text-[11px]">
                  ${tax.toFixed(2)}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-brand-text-muted text-[11px]">
                  Shipping & Handling
                </Text>

                <Text className="text-brand-text text-[11px]">
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </Text>
              </View>
            </View>

            <View className="h-[1px] bg-brand-border/60 my-1" />

            <View className="flex-row justify-between items-center">
              <Text className="text-brand-text font-bold text-sm">
                Total Paid
              </Text>

              <BookPrice price={total} size="md" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
