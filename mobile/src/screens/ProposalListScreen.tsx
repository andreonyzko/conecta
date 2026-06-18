import { View, Text } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { Redirect, usePathname } from "expo-router";
import Header from "@/components/common/layout/Header";
import { Badge } from "@/components/ui/badge";
import { proposalService } from "@/services/ProposalService";
import { callService } from "@/services/CallService";
import ProposalCard from "@/components/common/cards/ProposalCard";

export default function ProposalListScreen() {
  const { user } = useAuth();
  const route = useRoute();
  const path = usePathname();

  if (!user) return <Redirect href="/" />;

  if (user.type === "farmer" && path === `/farmer/${user.id}/proposals`) {
  }

  let { callId } = route.params as {
    callId: number;
  };
  callId = Number(callId);
  const call = callService.getCall(callId);
  const proposals = proposalService.getCallProposals(callId);

  if (!call) return <Redirect href="/" />;

  return (
    <View>
      <Header title="Propostas Recebidas" description={call.title}>
        <Badge className="bg-primary/20">
          <Text className="text-primary">{proposals.length}</Text>
        </Badge>
      </Header>
      <View className="flex-col gap-4 p-4">
        {proposals.map(p => (
          <ProposalCard key={p.id} proposal={p}/>
        ))}
      </View>
    </View>
  );
}
