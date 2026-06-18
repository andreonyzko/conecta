import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { TextInputProps, View } from "react-native";

type TextAreaFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  formControl: Control<T, any, any>;
};

export default function TextAreaField<T extends FieldValues>({
  name,
  label,
  formControl,
  ...props
}: TextAreaFieldProps<T> & TextInputProps) {
  return (
    <View className="flex gap-1">
      <Label className="text-sm text-muted">{label}</Label>
      <Controller
        control={formControl}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <Textarea
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
