import { View, Text, TextInputProps } from "react-native";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { Input } from "@/components/ui/input";

type InputFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  formControl: Control<T, any, any>;
};

export default function NumberField<T extends FieldValues>({
  name,
  label,
  formControl,
  ...props
}: InputFieldProps<T> & TextInputProps) {
  return (
    <View className="flex gap-1">
      <Label className="text-sm text-muted">{label}</Label>
      <Controller
        control={formControl}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <Input
              keyboardType="numeric"
              value={field.value}
              onChangeText={(text) => field.onChange(text.replace(/\D/g, ""))}
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
