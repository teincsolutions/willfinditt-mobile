// colors.ts
export const Colors = {
  light: {
    background: "#FFFFFF",
    backgroundGray: "#F2F2F7",
    black: "#000000",
    backgroundPrimary: "#f3efe3ff",
    text: "#1A1A1A",
    textWhite: "#FFFFFF",
    textGray: "#64748B",
    textLightGray: "#A0A0A0",
    primary: "#EF702A",
    secondary: "#FFCB11",
    accent: "#FFCB11",
    accentRed: "#FF383C",
    blue: "#3B82F6",
    green: "#4BB543",
    inputBg: "#FFFFFF",
    iconBlack: "#1C1C28",
    iconGray: "#64748B",
    iconWhite: "#FFFFFF",
    border: "#E2E8F0",
    error: "#FF4D4D",
  },

  dark: {
    background: "#0A0A0A",
    backgroundGray: "#181818",
    backgroundPrimary: "#212121",
    black: "#333333",
    text: "#FFFFFF",
    textGray: "#FEFEFE",
    textLightGray: "#D4D4D8",
    textWhite: "#ffffff",
    primary: "#FF823A", // Enhanced orange for dark mode
    secondary: "#FFD84A", // Enhanced yellow for dark mode
    accent: "#FFD84A", // Added accent color for dark mode
    accentRed: "#FF6B6B",
    blue: "#60A5FA",
    green: "#22946e",
    inputBg: "#1A1A1A",
    iconBlack: "#FCFCF8",
    iconWhite: "#FCFCF8",
    iconGray: "#FEFEFE",
    border: "#333333",
    error: "#FF6B6B",
  },
};

export type ThemeMode = keyof typeof Colors;
