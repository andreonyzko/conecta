import { useAuth } from "@/context/AuthContext";
import CallListScreen from "@/screens/CallListScreen";
import { Redirect, useLocalSearchParams } from "expo-router";
import React from "react";

export default function InstitutionCallsRoute() {
  const { user } = useAuth();
  const { institutionId } = useLocalSearchParams<{ institutionId: string }>();

  if (
    !user ||
    user.type !== "institution" ||
    user.id !== institutionId
  ) {
    return <Redirect href="/calls" />;
  }

  return <CallListScreen />;
}
