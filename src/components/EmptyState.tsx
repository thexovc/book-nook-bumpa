import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface EmptyStateProps {
  title: string;
  description: string;
  emoji?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  emoji = '📚',
  actionLabel,
  onAction,
}) => {
  return (
    <View className="flex-1 items-center justify-center p-6 gap-4">
      <Text className="text-5xl">{emoji}</Text>

      <View className="gap-1 items-center">
        <Text className="text-brand-text font-bold text-lg text-center">
          {title}
        </Text>
        <Text className="text-brand-text-muted text-sm text-center max-w-[280px]">
          {description}
        </Text>
      </View>

      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          className="bg-brand-surface border border-brand-border px-5 py-2.5 rounded-2xl shadow-sm active:opacity-70 transition-all mt-2"
        >
          <Text className="text-primary font-bold text-xs">
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
};
