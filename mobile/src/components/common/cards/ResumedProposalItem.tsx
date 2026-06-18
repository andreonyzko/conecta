import { View } from "react-native";
import React from "react";
import { ProposalItem } from "@/types/ProposalItem";
import { Text } from "@/components/ui/text";

type ResumedProposalItemProps = {
  item: ProposalItem;
};

export default function ResumedProposalItem({
  item,
}: ResumedProposalItemProps) {
  return (
    <View className="bg-card border border-border rounded-2xl p-4 flex-row">
      <View className="flex-1">
        <Text className="font-semibold">{item.product}</Text>
        <Text className="text-xs text-muted">
          {item.amount} {item.unity} x{" "}
          {item.unitPrice.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
      </View>
      <Text className="font-semibold text-primary">
        {item.total.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })}
      </Text>
    </View>
  );
}
