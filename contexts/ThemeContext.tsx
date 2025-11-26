// ThemeContext.tsx
import {
  ButtonSizes,
  Colors,
  Fonts,
  FontSizes,
  IconSizes,
  InputSizes,
  Radius,
  Shadows,
  Spacing,
} from "@/constants";
import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";

type ThemeContextType = {
  mode: "light" | "dark";
  colors: typeof Colors.light;
  spacing: typeof Spacing;
  radius: typeof Radius;
  fonts: typeof Fonts;
  fontSizes: typeof FontSizes;
  input: typeof InputSizes;
  button: typeof ButtonSizes;
  icons: typeof IconSizes;
  shadows: typeof Shadows.light;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemMode = useColorScheme();
  const mode = systemMode ?? "light";

  const value: ThemeContextType = useMemo(() => {
    return {
      mode,
      colors: Colors[mode],
      spacing: Spacing,
      radius: Radius,
      fonts: Fonts,
      fontSizes: FontSizes,
      input: InputSizes,
      button: ButtonSizes,
      icons: IconSizes,
      shadows: Shadows[mode],
    };
  }, [mode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
