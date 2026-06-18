import React from "react";
import ProposalDetailScreen from "@/screens/ProposalDetailScreen";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { mockCalls, mockProposals } from "@/data/mock";

export default function CallProposalDetailRoute() {
  const { user } = useAuth();
  const { callId, proposalId } = useLocalSearchParams<{
    callId: string;
    proposalId: string;
  }>();

  const call = mockCalls.find((c) => c.id === Number(callId));
  const proposal = mockProposals.find(
    (p) => p.id === Number(proposalId) && p.callId === Number(callId)
  );

  if (
    !call ||
    !proposal ||
    !user ||
    user.id !== call.institutionId ||
    user.id !== proposal.farmerId
  ) {
    return <Redirect href="/calls" />;
  }

  return <ProposalDetailScreen />;
}
