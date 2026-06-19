import React from "react";
import ProposalDetailScreen from "@/screens/ProposalDetailScreen";
import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function CallProposalDetailRoute() {
  const { user } = useAuth();

  if (!user) return <Redirect href="/" />;

  return <ProposalDetailScreen />;
}
