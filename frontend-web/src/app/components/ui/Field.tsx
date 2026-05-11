import React from 'react';
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { C } from '../../shared/theme';

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
  secureTextEntry,
  showSecureTextToggle,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  secureTextEntry?: boolean;
  showSecureTextToggle?: boolean;
}) {
  const [isSecure, setIsSecure] = React.useState(!!secureTextEntry);
  const shouldHideText = !!secureTextEntry && isSecure;

  const handleChangeText = (text: string) => {
    if (keyboardType !== 'numeric') {
      onChangeText(text);
      return;
    }

    const normalized = text.replace(',', '.').replace(/[^\d.]/g, '');
    const [integer, ...decimal] = normalized.split('.');
    onChangeText(decimal.length ? `${integer}.${decimal.join('')}` : integer);
  };

  return (
    <View className="gap-1.5">
      {!!label && <Text className="text-[13px] text-agro-muted">{label}</Text>}
      <View className={`flex-row items-center rounded-xl border border-agro-border bg-agro-bg px-3.5 ${multiline ? 'min-h-[94px] py-2' : 'py-0'}`}>
        <TextInput
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.dim}
          multiline={multiline}
          keyboardType={keyboardType === 'numeric' ? (Platform.OS === 'ios' ? 'decimal-pad' : 'numeric') : keyboardType}
          inputMode={keyboardType === 'numeric' ? 'decimal' : keyboardType === 'email-address' ? 'email' : undefined}
          secureTextEntry={shouldHideText}
          textContentType={secureTextEntry ? 'password' : undefined}
          autoComplete={secureTextEntry ? 'password' : undefined}
          autoCapitalize={secureTextEntry ? 'none' : undefined}
          autoCorrect={secureTextEntry ? false : undefined}
          showSoftInputOnFocus
          className={`flex-1 text-sm text-white ${multiline ? 'min-h-[78px]' : 'py-3'}`}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {showSecureTextToggle && (
          <TouchableOpacity
            accessibilityLabel={isSecure ? 'Mostrar senha' : 'Ocultar senha'}
            onPress={() => setIsSecure((current) => !current)}
            className="ml-2 h-10 w-10 items-center justify-center rounded-full"
          >
            {isSecure ? <Eye size={20} color={C.muted} /> : <EyeOff size={20} color={C.muted} />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
