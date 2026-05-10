import React from 'react';
import { Text, View } from 'react-native';

export function InfoCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <View className="gap-2.5 rounded-[18px] border border-agro-border bg-agro-panel p-4">
      <Text className="text-[11px] font-bold uppercase text-agro-muted">{title}</Text>
      {lines.map((line) => (
        <Text key={line} className="text-sm leading-5 text-white">
          {line}
        </Text>
      ))}
    </View>
  );
}
