import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <View className="flex-1 items-center justify-center p-6 gap-4">
      {/* Unicode warning alert triangle / warning icon */}
      <Text className="text-brand-accent text-5xl">⚠️</Text>

      <View className="gap-1.5 items-center">
        <Text className="text-brand-text font-bold text-lg text-center">
          Failed to Load Data
        </Text>
        <Text className="text-brand-text-muted text-sm text-center max-w-[280px]">
          {message || 'Please check your internet connection and try again.'}
        </Text>
      </View>

      <Pressable
        onPress={onRetry}
        className="bg-primary px-6 py-3 rounded-2xl shadow-md active:opacity-80 transition-all mt-2"
      >
        <Text className="text-white font-bold text-sm text-center">
          Try Again
        </Text>
      </Pressable>
    </View>
  );
};
