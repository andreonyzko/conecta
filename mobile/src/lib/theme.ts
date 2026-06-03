import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

export const THEME = {
  light: {
    background: "hsl(0 0% 7%)",
    foreground: "hsl(0 0% 100%)",

    card: "hsl(200 14% 13%)",
    cardForeground: "hsl(0 0% 100%)",

    popover: "hsl(200 14% 13%)",
    popoverForeground: "hsl(0 0% 100%)",

    primary: "hsl(166 77% 35%)",
    primaryForeground: "hsl(0 0% 100%)",

    secondary: "hsl(200 10% 18%)",
    secondaryForeground: "hsl(0 0% 100%)",

    muted: "hsl(200 10% 18%)",
    mutedForeground: "hsl(210 6% 72%)",

    accent: "hsl(200 10% 18%)",
    accentForeground: "hsl(0 0% 100%)",

    destructive: "hsl(6 78% 57%)",
    destructiveForeground: "hsl(0 0% 100%)",

    border: "hsl(210 7% 20%)",
    input: "hsl(210 7% 20%)",
    ring: "hsl(166 77% 35%)",

    radius: "0.75rem",

    chart1: "hsl(166 77% 35%)",
    chart2: "hsl(24 95% 53%)",
    chart3: "hsl(6 78% 57%)",
    chart4: "hsl(200 10% 18%)",
    chart5: "hsl(210 6% 72%)",

    success: "hsl(166 77% 35%)",
    successForeground: "hsl(0 0% 100%)",

    warning: "hsl(24 95% 53%)",
    warningForeground: "hsl(0 0% 100%)",
  },

  dark: {
    background: "hsl(0 0% 7%)",
    foreground: "hsl(0 0% 100%)",

    card: "hsl(200 14% 13%)",
    cardForeground: "hsl(0 0% 100%)",

    popover: "hsl(200 14% 13%)",
    popoverForeground: "hsl(0 0% 100%)",

    primary: "hsl(166 77% 35%)",
    primaryForeground: "hsl(0 0% 100%)",

    secondary: "hsl(200 10% 18%)",
    secondaryForeground: "hsl(0 0% 100%)",

    muted: "hsl(200 10% 18%)",
    mutedForeground: "hsl(210 6% 72%)",

    accent: "hsl(200 10% 18%)",
    accentForeground: "hsl(0 0% 100%)",

    destructive: "hsl(6 78% 57%)",
    destructiveForeground: "hsl(0 0% 100%)",

    border: "hsl(210 7% 20%)",
    input: "hsl(210 7% 20%)",
    ring: "hsl(166 77% 35%)",

    radius: "0.75rem",

    chart1: "hsl(166 77% 35%)",
    chart2: "hsl(24 95% 53%)",
    chart3: "hsl(6 78% 57%)",
    chart4: "hsl(200 10% 18%)",
    chart5: "hsl(210 6% 72%)",

    success: "hsl(166 77% 35%)",
    successForeground: "hsl(0 0% 100%)",

    warning: "hsl(24 95% 53%)",
    warningForeground: "hsl(0 0% 100%)",
  },
};

export const NAV_THEME: Record<"light" | "dark", Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};