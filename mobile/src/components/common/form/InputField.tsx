import { ReactNode } from "react";
import { Label } from "../../ui/label";
import { TextInputProps, View } from "react-native";
import { Controller, FieldValues, Path, type Control } from "react-hook-form";
import { Input } from "../../ui/input";
import { Text } from "../../ui/text";
import clsx from "clsx";

type InputFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  formControl: Control<T, any, any>;
};

export default function InputField<T extends FieldValues>({
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
              value={field.value}
              onChangeText={field.onChange}
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
