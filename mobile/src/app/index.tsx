import React from "react";
import AuthScreen from "@/screens/AuthScreen";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function AuthRoute() {
  const { isAuthenticated } = useAuth();

  if(isAuthenticated) return <Redirect href="/calls"/>

  return <AuthScreen/>;
}
