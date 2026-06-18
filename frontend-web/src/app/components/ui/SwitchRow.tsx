import React from 'react';
import { Switch, Text, View } from 'react-native';
import { C } from '../../shared/theme';

export function SwitchRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between rounded-[14px] border border-agro-border bg-agro-panel p-3.5">
      <Text className="text-sm leading-5 text-white">{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        thumbColor={value ? C.green : C.muted}
        trackColor={{ true: '#149D7F55', false: C.border }}
      />
    </View>
  );
}
