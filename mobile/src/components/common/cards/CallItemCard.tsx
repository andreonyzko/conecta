import { Trash } from "lucide-react-native";
import { Text } from "../../ui/text";
import { FREQUENCY_OPTIONS, UNITS_OPTIONS } from "@/utils/options";
import { THEME } from "@/lib/theme";
import { Button } from "../../ui/button";
import { View } from "react-native";
import {
  CallItemFormInputData,
  callItemFormSchema,
} from "../form/CallItemForm";

type CallItemCardProps = {
  item: CallItemFormInputData;
  handleRemove: () => void;
};

export default function CallItemCard({
  item,
  handleRemove,
}: CallItemCardProps) {
  return (
    <View className="flex-row bg-card border border-border p-4 rounded-2xl">
      <View className="flex-1">
        <Text className="text-sm">{item.product}</Text>
        <Text className="text-xs text-muted">
          {(item.amount as string) ?? "0"}{" "}
          {UNITS_OPTIONS.find((opt) => opt.value === item.unity)!.label} -{" "}
          {FREQUENCY_OPTIONS.find((opt) => opt.value === item.frequency)!.label}{" "}
          -{" "}
          {Number(item.referencePrice).toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })}{" "}
        </Text>
      </View>
      <View>
        <Button variant="ghost" onPress={handleRemove}>
          <Trash color={THEME.destructive} size={20} />
        </Button>
      </View>
    </View>
  );
}
