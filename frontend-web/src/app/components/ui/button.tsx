import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';

type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'default' | 'compact';

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
  size = 'default',
  grow = true,
  fullWidth = size !== 'compact',
  disabled,
}: {
  children: ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  grow?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}) {
  const sizing = size === 'compact' ? 'min-h-[32px] px-3' : 'min-h-[46px] px-4';
  const layout = grow ? 'flex-1' : fullWidth ? 'w-full' : 'self-start';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      className={`${layout} ${sizing} items-center justify-center rounded-full ${containerByVariant[variant]} ${
        disabled ? 'opacity-45' : ''
      }`}
    >
      <Text className={`text-center font-bold ${size === 'compact' ? 'text-xs' : 'text-sm'} ${textByVariant[variant]}`}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
