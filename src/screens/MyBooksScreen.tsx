import { BookPrice } from '@/components/BookPrice';
import { EmptyState } from '@/components/EmptyState';
import { PurchaseOrder, selectOrders, usePurchasesStore } from '@/store/purchases-store';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Collapsible Order Card ───────────────────────────────────────────────────

interface OrderCardProps {
  item: PurchaseOrder;
  index: number;
  onViewDetails: (orderId: string) => void;
}

function OrderCard({ item, index, onViewDetails }: OrderCardProps) {
  const [expanded, setExpanded] = useState(true);
  const chevronRotation = useSharedValue(1); // 1 = expanded, 0 = collapsed

  const toggleExpanded = useCallback(() => {
    const next = !expanded;
    setExpanded(next);
    chevronRotation.value = withTiming(next ? 1 : 0, { duration: 250 });
  }, [expanded, chevronRotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(chevronRotation.value, [0, 1], [0, 180])}deg`,
      },
    ],
  }));

  const totalBooks = item.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify().damping(18)}
      className="bg-brand-surface border border-brand-border rounded-2xl mb-4 shadow-sm overflow-hidden"
    >
      {/* ── Order Header (always visible, tap to collapse) ── */}
      <Pressable
        onPress={toggleExpanded}
        className="p-4 active:opacity-80"
      >
        <View className="flex-row justify-between items-center">
          {/* Left: ID + date */}
          <View className="flex-1 mr-3">
            <Text className="text-brand-text font-bold text-xs tracking-wide">
              {item.orderId}
            </Text>
            <Text className="text-brand-text-muted text-[10px] mt-0.5">
              {item.date} · {totalBooks} {totalBooks === 1 ? 'book' : 'books'}
            </Text>
          </View>

          {/* Right: price + chevron */}
          <View className="flex-row items-center gap-3">
            <BookPrice price={item.totalPrice} size="sm" />
            <Animated.Text style={[{ fontSize: 12, color: '#64748B' }, chevronStyle]}>
              ▲
            </Animated.Text>
          </View>
        </View>

        {/* Cover strip — only visible when collapsed */}
        {!expanded && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3 -mx-1"
            contentContainerStyle={{ paddingHorizontal: 4, gap: 8 }}
          >
            {item.items.map((cartItem) =>
              cartItem.book.coverUrl ? (
                <View
                  key={cartItem.book.id}
                  className="w-[52px] h-[72px] rounded-lg overflow-hidden bg-brand-bg border border-brand-border/40"
                >
                  <Image
                    source={{ uri: cartItem.book.coverUrl }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={200}
                  />
                </View>
              ) : (
                <View
                  key={cartItem.book.id}
                  className="w-[52px] h-[72px] rounded-lg bg-brand-border/30 items-center justify-center"
                >
                  <Text className="text-lg">📚</Text>
                </View>
              )
            )}
          </ScrollView>
        )}
      </Pressable>

      {/* ── Expanded Detail List ── */}
      {expanded && (
        <Animated.View
          entering={FadeIn.duration(200)}
          className="border-t border-brand-border/50 mx-4 pt-3 pb-4 gap-3"
        >
          {item.items.map((cartItem) => (
            <View key={cartItem.book.id} className="flex-row items-center gap-3">
              {/* Larger cover in detail */}
              <TouchableOpacity onPress={() => onViewDetails(item.orderId)} className="w-[56px] h-[80px] rounded-xl overflow-hidden bg-brand-bg border border-brand-border/40 shadow-sm">
                {cartItem.book.coverUrl ? (
                  <Image
                    source={{ uri: cartItem.book.coverUrl }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={200}
                  />
                ) : (
                  <View className="w-full h-full items-center justify-center">
                    <Text className="text-lg">📚</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Book meta */}
              <View className="flex-1 gap-0.5">
                <Text className="text-brand-text font-semibold text-sm" numberOfLines={2}>
                  {cartItem.book.title}
                </Text>
                <Text className="text-brand-text-muted text-[11px]" numberOfLines={1}>
                  by {cartItem.book.authors.join(', ')}
                </Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <Text className="text-primary font-bold text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                    Qty: {cartItem.quantity}
                  </Text>
                  <Text className="text-brand-text-muted text-[11px] font-semibold">
                    ${(cartItem.book.price * cartItem.quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          {/* View receipt link */}
          <Pressable
            onPress={() => onViewDetails(item.orderId)}
            className="mt-1 flex-row items-center gap-1 self-start active:opacity-60"
          >
            <Text className="text-primary text-xs font-semibold">View receipt</Text>
            <Text className="text-primary text-xs">→</Text>
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function MyBooksScreen() {
  const orders = usePurchasesStore(selectOrders);

  const handleBrowse = () => router.push('/');
  const handleViewDetails = (orderId: string) => router.push(`/transaction/${orderId}`);

  const totalBooksOwned = orders.reduce(
    (acc, o) => acc + o.items.reduce((sum, i) => sum + i.quantity, 0),
    0
  );

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-brand-bg">
      <View style={{ flex: 1 }} className="px-4 pt-4">
        {/* Header */}
        <View className="mb-5 px-1">
          <Text className="text-primary font-bold text-2xl font-serif">My Books</Text>
          <Text className="text-brand-text-muted text-xs font-semibold mt-0.5">
            {orders.length === 0
              ? 'Your personal library is empty'
              : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} · ${totalBooksOwned} ${totalBooksOwned === 1 ? 'book' : 'books'} owned`}
          </Text>
        </View>

        {/* Order list */}
        {orders.length === 0 ? (
          <View className="flex-1 justify-center pb-20">
            <EmptyState
              title="No Books Purchased Yet"
              description="Books you purchase securely will appear in your digital library here."
              emoji="📚"
              actionLabel="Explore Catalog"
              onAction={handleBrowse}
            />
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.orderId}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <OrderCard
                item={item}
                index={index}
                onViewDetails={handleViewDetails}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
