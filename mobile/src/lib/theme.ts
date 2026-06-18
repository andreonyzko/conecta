import { DefaultTheme, type Theme } from "@react-navigation/native";

export const THEME = {
  background: '#121212',
  foreground: '#FFFFFF',
  
  card: '#1D2226',
  cardForeground: '#FFFFFF',
  popover: '#1D2226',
  popoverForeground: '#FFFFFF',
  
  primary: '#149D7F',
  primaryForeground: '#FFFFFF',
  
  secondary: '#242A2F',
  secondaryForeground: '#FFFFFF',
  destructive: '#E74C3C',
  destructiveForeground: '#FFFFFF',
  warning: '#FBBF24',
  warningForeground: '#FFFFFF',
  success: '#149D7F',
  successForeground: '#FFFFFF',
  
  border: '#2F3336',
  input: '#2F3336',
  muted: '#B0B3B8',
  mutedForeground: '#6F767E',
  accent: '#6F767E',
  accentForeground: '#FFFFFF',
  
  chart1: '#149D7F',
  chart2: '#F97316',
  chart3: '#E74C3C',
  chart4: '#2F3336',
  chart5: '#B0B3B8',
  
  radius: '0.75rem',    // 12px (padrão)
};

// Para React Navigation
export const NAV_THEME: Theme = {
  ...DefaultTheme,
  colors: {
    background: THEME.background,
    border: THEME.border,
    card: THEME.card,
    notification: THEME.destructive,
    primary: THEME.primary,
    text: THEME.foreground,
  },
};