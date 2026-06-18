import React from "react";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeProvider } from "@react-navigation/native";
import { AuthProvider } from "@/context/AuthContext";
import { NAV_THEME } from "@/lib/theme";
import "../../global.css";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={NAV_THEME}>
        <AuthProvider>
          <SafeAreaView className="flex-1">
            <Stack screenOptions={{ headerShown: false, animation: "none" }} />
            <PortalHost />
          </SafeAreaView>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
