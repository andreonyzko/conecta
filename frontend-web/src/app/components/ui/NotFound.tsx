import React from 'react';
import { Text, View } from 'react-native';
import { Nav } from '../../navigation/types';
import { Button } from './ui';

export function NotFound({ text, nav }: { text: string; nav: Nav }) {
  return <View className="flex-1 bg-agro-bg"><View className="items-center justify-center gap-2.5 py-9"><Text className="text-center text-[13px] text-agro-muted">{text}</Text><Button variant="ghost" onPress={nav.back}>Voltar</Button></View></View>;
}
