import { Pressable, View } from "react-native";
import React from "react";
import { Proposal } from "@/types/Proposal";
import { CircleCheck, Truck, User } from "lucide-react-native";
import { THEME } from "@/lib/theme";
import { farmerService } from "@/services/FarmerService";
import { Link, Redirect } from "expo-router";
import { Text } from "@/components/ui/text";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";

type ProposalCardProps = {
  proposal: Proposal;
};

export default function ProposalCard({ proposal }: ProposalCardProps) {
  const farmer = farmerService.getFarmer(proposal.id);

  if (!farmer) return <Redirect href="/" />;

  return (
    <Link href={`/calls/${proposal.callId}/proposals/${proposal.id}`} asChild>
      <Pressable>
        <View className="bg-card border border-border rounded-2xl p-4 flex gap-3">
          <View className="flex-row">
            <View className="flex-1 flex-row items-center gap-3">
              <View className="bg-accent p-2 rounded-full">
                <User color={THEME.muted} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold">{farmer.name}</Text>
                <Text
                  className={clsx(
                    "text-xs",
                    proposal.status == "accepted" && "text-success",
                    proposal.status == "pending" && "text-warning",
                    proposal.status == "rejected" && "text-destructive",
                    proposal.status == "canceled" && "text-destructive"
                  )}
                >
                  {proposal.status == "accepted" && "Aceito"}
                  {proposal.status == "pending" && "Pendente"}
                  {proposal.status == "rejected" && "Rejeitado"}
                  {proposal.status == "canceled" && "Cancelado"}
                </Text>
              </View>
            </View>
            <View>
              <Text className="font-bold">
                {proposal.totalValue.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </View>
          </View>
          <View className="flex-row items-end">
            <View className="flex-1 flex-col gap-3">
              <Badge className={clsx("self-start bg-accent", proposal.delivery && "bg-primary/20")}>
                <Truck size={15} color={proposal.delivery ? THEME.primary : THEME.muted}/>
                <Text>{proposal.delivery ? "Entrega própria" : "Sem entrega"}</Text>
              </Badge>
              <Text className="text-xs text-muted">
                {proposal.itens
                  .map((i) => `${i.product} (${i.amount + i.unity})`)
                  .join(", ")}
              </Text>
              <Text className="text-xs text-muted">
                Toque em cima para visualizar a proposta completa
              </Text>
            </View>
            <CircleCheck size={15} color={THEME.primary} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
