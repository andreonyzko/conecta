import React from 'react';
import { Text, View } from 'react-native';
import { Button } from './Button';

export function Empty({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View className="items-center justify-center gap-2.5 py-9">
      <Text className="text-center text-base font-bold text-white">{title}</Text>
      {!!subtitle && <Text className="text-center text-[13px] text-agro-muted">{subtitle}</Text>}
      {!!action && !!onAction && <Button onPress={onAction}>{action}</Button>}
    </View>
  );
}
