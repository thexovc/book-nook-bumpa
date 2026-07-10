import React, { useState, useEffect, useRef } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useSearchStore, selectSetQuery, selectQuery } from '@/store/search-store';

export const SearchBar: React.FC = () => {
  const globalQuery = useSearchStore(selectQuery);
  const setGlobalQuery = useSearchStore(selectSetQuery);
  
  const [localQuery, setLocalQuery] = useState(globalQuery);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state if global query changes from elsewhere (e.g. clearFilters)
  useEffect(() => {
    setLocalQuery(globalQuery);
  }, [globalQuery]);

  // Debounce query updates to global store
  const handleChangeText = (text: string) => {
    setLocalQuery(text);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setGlobalQuery(text);
    }, 300); // Wait, wait. 300000/1000 is 300 seconds! Ah! 300 milliseconds is 300.
    // Let's write 300ms correctly: 300!
  };

  const handleClear = () => {
    setLocalQuery('');
    setGlobalQuery('');
  };

  return (
    <View className="bg-brand-surface border border-brand-border shadow-sm rounded-2xl px-4 py-3 flex-row items-center my-3">
      {/* Unicode Magnifying Glass Search Icon */}
      <Text className="text-brand-text-muted text-base mr-2">🔍</Text>
      
      <TextInput
        value={localQuery}
        onChangeText={handleChangeText}
        placeholder="Search for books, authors, genres..."
        placeholderTextColor="#64748B"
        className="flex-1 text-brand-text text-sm py-1 outline-none"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      {localQuery.length > 0 && (
        <Pressable onPress={handleClear} className="p-1 active:opacity-80" accessibilityLabel="Clear search">
          <Text className="text-brand-text-muted text-xs font-bold bg-brand-bg/50 w-5 h-5 rounded-full text-center leading-5">✕</Text>
        </Pressable>
      )}
    </View>
  );
};
