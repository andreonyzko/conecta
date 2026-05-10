import React from 'react';
import { Text } from 'react-native';
import { C } from '../../shared/theme';

export function Icon({
  name,
  size = 20,
  color = C.muted,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  return <Text style={{ color, fontSize: size, lineHeight: size + 4 }}>{name}</Text>;
}
