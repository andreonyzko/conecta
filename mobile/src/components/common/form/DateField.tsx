import { View, Text } from "react-native";
import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { THEME } from "@/lib/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react-native";
import clsx from "clsx";

type DateFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  formControl: Control<T, any, any>;
};

export default function DateField<T extends FieldValues>({
  name,
  label,
  formControl,
}: DateFieldProps<T>) {
  const [show, setShow] = useState(false);

  return (
    <View className="flex gap-1 flex-1">
      <Label className="text-sm text-muted">{label}</Label>
      <Controller
        name={name}
        control={formControl}
        render={({ field, fieldState }) => (
          <>
            <View className="relative">
              <Input
                value={(field.value as Date).toLocaleDateString("pt-br")}
                className={clsx("bg-card", fieldState.error && "border-destructive")}
                onPress={() => setShow((prev) => !prev)}
              />
              <View className="absolute right-5 top-4">
                <Calendar color="white" size={15}/>
              </View>
            </View>
            {show && (
              <DateTimePicker
                value={field.value}
                mode="date"
                onChange={(_, date) => {
                  setShow(false);
                  if (date) field.onChange(date);
                }}
              />
            )}
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
