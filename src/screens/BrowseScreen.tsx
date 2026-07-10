import { BookCard } from '@/components/BookCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { BookCardSkeleton } from '@/components/LoadingSkeleton';
import { SearchBar } from '@/components/SearchBar';
import { useBooks } from '@/hooks/use-books';
import { selectQuery, selectSelectedCategory, useSearchStore } from '@/store/search-store';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeaderCartButton } from '@/components/HeaderCartButton';

export default function BrowseScreen() {
  const query = useSearchStore(selectQuery);
  const selectedCategory = useSearchStore(selectSelectedCategory);

  const {
    books,
    loading,
    loadingMore,
    error,
    loadMore,
    refresh,
    retry,
  } = useBooks(query, selectedCategory);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <BookCard book={item} index={index} />
  );

  const renderHeader = () => (
    <View className="pt-2 px-1">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1 mr-2">
          <Text className="text-primary font-bold text-3xl font-serif">
            Book Nook
          </Text>
          <Text className="text-brand-text-muted text-[10px] font-semibold uppercase tracking-wider mt-0.5" numberOfLines={1}>
            Independent Bookstore Catalog
          </Text>
        </View>
        <HeaderCartButton />
      </View>
      <SearchBar />
      <CategoryFilter loading={loading} />
    </View>
  );

  const renderContent = () => {
    if (error && books.length === 0) {
      return (
        <View className="flex-1 justify-center py-10">
          <ErrorState message={error} onRetry={retry} />
        </View>
      );
    }

    if (loading && books.length === 0) {
      return (
        <View className="px-4 py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </View>
      );
    }

    return (
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        onRefresh={refresh}
        refreshing={false}
        ListFooterComponent={
          loadingMore ? (
            <View className="py-6 items-center">
              <ActivityIndicator color="#0F172A" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View className="py-12 flex-1 justify-center">
            <EmptyState
              title="No Books Found"
              description={
                query.trim()
                  ? `We couldn't find any books matching "${query}".`
                  : 'There are no books currently listed in this category.'
              }
              emoji="🔍"
            />
          </View>
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={10}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-brand-bg">
      <View style={{ flex: 1 }}>
        {/* Header container */}
        <View className="px-4 pt-2">
          {renderHeader()}
        </View>

        {/* Main List */}
        <View style={{ flex: 1 }}>
          {renderContent()}
        </View>
      </View>
    </SafeAreaView>
  );
}
