import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { C } from '../../shared/theme';
import { Badge } from './Badge';
import { Icon } from './Icon';

export function Header({
  title,
  subtitle,
  onBack,
  badge,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  badge?: string;
}) {
  return (
    <View className="border-b border-agro-border bg-agro-panel px-3 py-3">
      <View className="flex-row items-center gap-2.5">
        {onBack && (
          <TouchableOpacity onPress={onBack} className="h-[38px] w-[38px] items-center justify-center rounded-full">
            <Icon name="‹" size={30} color={C.text} />
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <Text className="text-base font-bold text-white">{title}</Text>
          {!!subtitle && (
            <Text className="mt-0.5 text-xs text-agro-muted" numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        {!!badge && <Badge label={badge} />}
      </View>
    </View>
  );
}
