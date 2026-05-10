import React from 'react';
import { Text, View } from 'react-native';

type BadgeTone = 'green' | 'red' | 'yellow' | 'gray' | 'orange';

const toneClass: Record<BadgeTone, string> = {
  green: 'bg-agro-green/15 text-agro-green',
  red: 'bg-agro-red/15 text-agro-red',
  yellow: 'bg-agro-yellow/15 text-agro-yellow',
  gray: 'bg-agro-border text-agro-muted',
  orange: 'bg-agro-orange/15 text-agro-orange',
};

export function Badge({ label, tone = 'green' }: { label: string; tone?: BadgeTone }) {
  const [bg, text] = toneClass[tone].split(' ');
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${bg}`}>
      <Text className={`text-[11px] font-bold ${text}`}>{label}</Text>
    </View>
  );
}
