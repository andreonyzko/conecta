import { View, Text, TextInputProps } from "react-native";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { formatCNPJ } from "@/utils/formatters";

type CNPJFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  formControl: Control<T>;
};

export default function CNPJField<T extends FieldValues>({
  name,
  label,
  formControl,
  ...props
}: CNPJFieldProps<T> & TextInputProps) {
  return (
    <View className="flex gap-1">
      <Label className="text-sm text-muted">{label}</Label>
      <Controller
        name={name}
        control={formControl}
        render={({ field, fieldState }) => (
          <>
            <Input
              placeholder="00.000.000/0000-00"
              keyboardType="numeric"
              value={field.value}
              onChangeText={(text) => field.onChange(formatCNPJ(text.replace(/\D/g, "")))}
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
