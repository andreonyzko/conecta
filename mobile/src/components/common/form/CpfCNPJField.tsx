import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { formatCpfCnpj } from "@/utils/formatters";
import clsx from "clsx";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { TextInputProps, View } from "react-native";

type CpfCNPJFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  formControl: Control<T>;
};

export default function CpfCNPJField<T extends FieldValues>({
  name,
  label,
  formControl,
  ...props
}: CpfCNPJFieldProps<T> & TextInputProps) {
  return (
    <View className="flex gap-1">
      <Label className="text-sm text-muted">{label}</Label>
      <Controller
        name={name}
        control={formControl}
        render={({ field, fieldState }) => (
          <>
            <Input
              placeholder="000.000.000-00"
              keyboardType="numeric"
              value={field.value}
              onChangeText={(text) => field.onChange(formatCpfCnpj(text.replace(/\D/g, "")))}
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
