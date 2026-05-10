import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View className="mt-2 flex-row items-center justify-between">
      <Text className="text-[15px] font-extrabold text-white">{title}</Text>
      {!!action && (
        <TouchableOpacity onPress={onAction}>
          <Text className="text-[13px] font-bold text-agro-green">{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
