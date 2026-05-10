import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { C } from '../../shared/theme';

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
}) {
  return (
    <View className="gap-1.5">
      {!!label && <Text className="text-[13px] text-agro-muted">{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.dim}
        multiline={multiline}
        keyboardType={keyboardType}
        className={`rounded-xl border border-agro-border bg-agro-bg px-3.5 py-3 text-sm text-white ${
          multiline ? 'min-h-[94px]' : ''
        }`}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}
