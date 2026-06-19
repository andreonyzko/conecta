import React from "react";
import ProposalListScreen from "@/screens/ProposalListScreen";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function CallProposalsRoute() {
  const { user } = useAuth();

  if (!user || user.type !== "institution") {
    return <Redirect href="/calls" />;
  }

  return <ProposalListScreen />;
}
