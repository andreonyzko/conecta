import { Label } from "@/components/ui/label";
import {
  Option,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import clsx from "clsx";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { View } from "react-native";

type SelectFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options: Option[];
  formControl: Control<T, any, any>;
  className?: string;
};

export default function SelectField<T extends FieldValues>({
  name,
  label,
  options,
  formControl,
  className,
}: SelectFieldProps<T>) {
  return (
    <View className="flex gap-1">
      <Label className="text-sm text-muted">{label}</Label>
      <Controller
        control={formControl}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <Select
              value={
                options.find((opt) => opt!.value === field.value) ?? options[0]
              }
              onValueChange={opt => field.onChange(opt?.value)}
            >
              <SelectTrigger
                className={clsx(
                  className,
                  fieldState.error && "border border-destructive"
                )}
              >
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem
                    key={opt!.value}
                    label={opt!.label}
                    value={opt!.value}
                  />
                ))}
              </SelectContent>
            </Select>
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
