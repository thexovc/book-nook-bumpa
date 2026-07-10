import { BookPrice } from '@/components/BookPrice';
import { CheckoutForm } from '@/components/CheckoutForm';
import { processCheckout } from '@/services/api';
import {
  selectClearCart,
  selectItems,
  selectTotalPrice,
  useCartStore,
} from '@/store/cart-store';
import { usePurchasesStore, selectAddOrder } from '@/store/purchases-store';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function CheckoutScreen() {
  const items = useCartStore(selectItems);
  const subtotal = useCartStore(selectTotalPrice);
  const clearCart = useCartStore(selectClearCart);
  const addOrder = usePurchasesStore(selectAddOrder);

  const [loading, setLoading] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const tax = subtotal * 0.075;
  const shipping = subtotal > 35 ? 0 : 3.99;
  const total = subtotal + tax + shipping;

  const handleBack = () => {
    router.back();
  };

  const handleFormSubmit = async (details: { name: string; email: string; cardNumber: string }) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await processCheckout(items, details);
      if (response.success) {
        addOrder({
          orderId: response.orderId,
          date: new Date().toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          items: [...items],
          totalPrice: total,
        });
        setSuccessOrderId(response.orderId);
        clearCart();
      } else {
        setErrorMsg('Payment declined. Please try with another card.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessOrderId(null);
    router.dismissAll();
    router.replace('/');
  };

  if (successOrderId) {
    return (
      <View style={{ flex: 1 }} className="bg-brand-bg items-center justify-center p-6 gap-6">
        <Text className="text-emerald-500 text-6xl">✓</Text>
        <View className="gap-2 items-center">
          <Text className="text-brand-text font-bold text-2xl text-center font-serif">
            Order Confirmed!
          </Text>
          <Text className="text-brand-text-muted text-sm text-center max-w-[280px]">
            Thank you for your purchase. Your order ID is{' '}
            <Text className="text-primary font-bold">{successOrderId}</Text>.
          </Text>
          <Text className="text-brand-text-muted text-xs text-center mt-1">
            We have sent a receipt details email to your mailbox.
          </Text>
        </View>

        <Pressable
          onPress={handleSuccessClose}
          className="bg-primary px-8 py-3.5 rounded-2xl shadow-md active:opacity-80 transition-all mt-4 w-full max-w-[240px]"
        >
          <Text className="text-white font-bold text-sm text-center">
            Continue Shopping
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} className="bg-brand-bg">
      {/* Header */}
      <View className="pt-12 px-4 flex-row items-center justify-between mb-4">
        <Pressable
          onPress={handleBack}
          className="bg-brand-surface w-10 h-10 rounded-full items-center justify-center border border-brand-border shadow-sm active:opacity-70 transition-all"
          accessibilityLabel="Go back"
        >
          <Text className="text-primary text-xl font-bold">←</Text>
        </Pressable>
        <Text className="text-brand-text font-bold text-lg">Secure Checkout</Text>
        <View className="w-10" />
      </View>

      <View className="p-4 gap-6 pb-20">
        {/* Order Summary */}
        <View className="bg-brand-surface border border-brand-border shadow-sm rounded-2xl p-4 gap-3">
          <Text className="text-brand-text font-bold text-sm font-serif">Order Summary</Text>

          <View className="gap-2 mt-1">
            <View className="flex-row justify-between">
              <Text className="text-brand-text-muted text-xs">Items Subtotal</Text>
              <Text className="text-brand-text text-xs">${subtotal.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-brand-text-muted text-xs">Sales Tax (7.5%)</Text>
              <Text className="text-brand-text text-xs">${tax.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-brand-text-muted text-xs">Shipping</Text>
              <Text className="text-brand-text text-xs">
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </Text>
            </View>
          </View>

          <View className="h-[1px] bg-brand-text-muted/10 my-1" />

          <View className="flex-row justify-between items-center">
            <Text className="text-brand-text font-bold text-sm">Total Due</Text>
            <BookPrice price={total} size="md" />
          </View>
        </View>

        {/* Payment Form */}
        <View className="bg-brand-surface border border-brand-border shadow-sm rounded-2xl p-4 gap-4">
          <View className="gap-0.5">
            <Text className="text-brand-text font-bold text-sm font-serif">Payment Method</Text>
            <Text className="text-brand-text-muted text-[10px]">
              Use any card starting with 4, 5, 2, or 37 to mock success, others to mock decline.
            </Text>
          </View>

          {errorMsg && (
            <View className="bg-brand-accent/10 border border-brand-accent/20 rounded-xl p-3">
              <Text className="text-brand-accent text-xs text-center font-medium">
                {errorMsg}
              </Text>
            </View>
          )}

          <CheckoutForm onSubmit={handleFormSubmit} loading={loading} />
        </View>
      </View>
    </ScrollView>
  );
}
