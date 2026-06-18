import { CallItem } from "@/types/CallItem";
import { View } from "react-native";
import { Text } from "../../ui/text";
import { FREQUENCY_OPTIONS, UNITS_OPTIONS } from "@/utils/options";

type ResumedCallCardProps = {
  item: CallItem;
};

export default function ResumedCallItemCard({ item }: ResumedCallCardProps) {
  return (
    <View className="bg-card border border-border p-3 rounded-2xl flex-row">
      <View className="flex-1">
        <Text className="font-bold">{item.product}</Text>
        <Text className="text-xs text-muted">
          {item.category} - {item.frequency}
        </Text>
      </View>
      <View>
        <Text className="font-bold">
          {item.amount} {item.unity}
        </Text>
        <Text className="text-xs text-primary">
          Ref.{" "}
          {Number(item.referencePrice).toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })}
          /{item.unity}
        </Text>
      </View>
    </View>
  );
}
