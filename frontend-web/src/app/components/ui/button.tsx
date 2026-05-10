import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';

type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost';

const containerByVariant: Record<ButtonVariant, string> = {
  primary: 'bg-agro-green',
  outline: 'border border-agro-border bg-transparent',
  danger: 'border border-agro-red bg-transparent',
  ghost: 'min-h-[34px] bg-transparent',
};

const textByVariant: Record<ButtonVariant, string> = {
  primary: 'text-white',
  outline: 'text-white',
  danger: 'text-agro-red',
  ghost: 'text-agro-green',
};

export function Button({
  children,
  onPress,
  variant = 'primary',
  disabled,
}: {
  children: ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      className={`flex-1 min-h-[46px] items-center justify-center rounded-full px-4 ${containerByVariant[variant]} ${
        disabled ? 'opacity-45' : ''
      }`}
    >
      <Text className={`text-center text-sm font-bold ${textByVariant[variant]}`}>{children}</Text>
    </TouchableOpacity>
  );
}
