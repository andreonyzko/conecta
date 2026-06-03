import React from "react";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeProvider } from "@react-navigation/native";
import { AuthProvider } from "@/context/AuthContext";
import { NAV_THEME } from "@/lib/theme";
import "../../global.css";

export default function RootLayout() {
  return (
    <ThemeProvider value={NAV_THEME.dark}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}/>
        <PortalHost />
      </AuthProvider>
    </ThemeProvider>
  );
}
