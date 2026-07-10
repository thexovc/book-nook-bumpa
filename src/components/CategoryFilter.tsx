import { selectSelectedCategory, selectSetCategory, useSearchStore } from '@/store/search-store';
import React from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

const CATEGORIES = [
  { label: 'All Books', value: null },
  { label: 'Fiction', value: 'Fiction' },
  { label: 'Science', value: 'Science' },
  { label: 'History', value: 'History' },
  { label: 'Fantasy', value: 'Fantasy' },
  { label: 'Biography', value: 'Biography' },
  { label: 'Technology', value: 'Technology' },
  { label: 'Philosophy', value: 'Philosophy' },
];

interface CategoryFilterProps {
  loading?: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ loading = false }) => {
  const selectedCategory = useSearchStore(selectSelectedCategory);
  const setCategory = useSearchStore(selectSetCategory);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-row py-2 mb-3"
      contentContainerStyle={{ paddingRight: 16 }}
    >
      {CATEGORIES.map((cat, index) => {
        const isSelected = selectedCategory === cat.value;
        return (
          <Animated.View
            key={index}
            entering={FadeInRight.delay(index * 40).springify().damping(18)}
          >
            <Pressable
              onPress={() => setCategory(cat.value)}
              className={`mr-2.5 px-4 py-2 rounded-full border shadow-sm ${
                isSelected
                  ? 'bg-primary border-primary'
                  : 'bg-brand-surface border-brand-border active:opacity-70'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isSelected ? 'text-brand-bg' : 'text-brand-text-muted'
                }`}
              >
                {cat.label}
              </Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
};
