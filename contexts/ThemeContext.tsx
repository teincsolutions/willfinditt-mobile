import {
  AvatarSizes,
  ButtonIconSizes,
  ButtonSizes,
  ButtonTextSizes,
  CardSizes,
  Colors,
  Fonts,
  FontSizes,
  IconSizes,
  InputSizes,
  InputSmSizes,
  PillSizes,
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
  inputSmall: typeof InputSizes;
  button: typeof ButtonSizes;
  iconButton: typeof ButtonIconSizes;
  textButton: typeof ButtonTextSizes;
  avatarSize: typeof AvatarSizes;
  icons: typeof IconSizes;
  shadows: typeof Shadows.light;
  card: typeof CardSizes;
  pill: typeof PillSizes;
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
      inputSmall: InputSmSizes,
      button: ButtonSizes,
      iconButton: ButtonIconSizes,
      textButton: ButtonTextSizes,
      avatarSize: AvatarSizes,
      icons: IconSizes,
      shadows: Shadows[mode],
      card: CardSizes,
      pill: PillSizes,
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
