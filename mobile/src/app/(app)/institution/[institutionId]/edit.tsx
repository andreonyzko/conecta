import { useAuth } from "@/context/AuthContext";
import InstitutionFormScreen from "@/screens/InstitutionFormScreen";
import { Redirect, useLocalSearchParams } from "expo-router";
import React from "react";

export default function InstitutionEditProfileRoute() {
  const { user } = useAuth();
  const { institutionId } = useLocalSearchParams<{ institutionId: string }>();

  if (
    !user ||
    user.type !== "institution" ||
    user.id !== institutionId
  ) {
    return <Redirect href="/calls" />;
  }

  return <InstitutionFormScreen />;
}
