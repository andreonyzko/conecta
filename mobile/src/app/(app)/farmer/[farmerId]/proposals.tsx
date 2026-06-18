import React from "react";
import ProposalListScreen from "@/screens/ProposalListScreen";
import { useAuth } from "@/context/AuthContext";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function FarmerProposalsRoute() {
  const { user } = useAuth();
  const { farmerId } = useLocalSearchParams<{ farmerId: string }>();

  if (!user || user.type !== "farmer" || user.id !== Number(farmerId)) {
    return <Redirect href="/calls" />;
  }

  return <ProposalListScreen />;
}
