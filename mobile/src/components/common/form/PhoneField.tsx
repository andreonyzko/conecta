import { TextInputProps, View } from "react-native";
import React, { ReactNode } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import clsx from "clsx";
import { formatPhone } from "@/utils/formatters";

type PhoneFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  formControl: Control<T>;
};

export default function PhoneField<T extends FieldValues>({
  name,
  label,
  formControl,
  ...props
}: PhoneFieldProps<T> & TextInputProps) {
  return (
    <View className="flex gap-1">
      <Label className="text-sm text-muted">{label}</Label>
      <Controller
        name={name}
        control={formControl}
        render={({ field, fieldState }) => (
          <>
            <Input
              placeholder="(00) 00000-0000"
              keyboardType="numeric"
              value={field.value}
              onChangeText={(text) => field.onChange(formatPhone(text.replace(/\D/g, "")))}
              onBlur={field.onBlur}
              {...props}
              className={clsx(fieldState.error && "border-destructive", props.className)}
            />
            {fieldState.error && (
              <Text className="text-destructive text-xs">
                {fieldState.error.message}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
}
