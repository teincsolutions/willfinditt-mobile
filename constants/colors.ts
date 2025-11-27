// colors.ts
export const Colors = {
  light: {
    background: "#FFFFFF",
    backgroundGray: "#F2F2F7",
    text: "#1A1A1A",
    textWhite: "#FFFFFF",
    textGray: "#64748B",
    primary: "#EF702A",
    secondary: "#FFCB11",
    acent: "#FFCB11",
    inputBg: "#FFFFFF",
    iconBlack: "#1C1C28",
    iconGray: "#64748B",
    iconWhite: "#FFFFFF",
    border: "#E2E8F0",
    error: "#FF4D4D",
  },

  dark: {
    background: "#000000",
    backgroundGray: "#000000",
    text: "#FFFFFF",
    textGray: "#FEFEFE",
    textWhite: "#ffffff",
    primary: "#FF823A", // Enhanced orange for dark mode
    secondary: "#FFD84A", // Enhanced yellow for dark mode
    acent: "#FFD84A", // Added accent color for dark mode
    inputBg: "#1A1A1A",
    iconBlack: "#FCFCF8",
    iconWhite: "#FCFCF8",
    iconGray: "#FEFEFE",
    border: "#333333",
    error: "#FF6B6B",
  },
};

export type ThemeMode = keyof typeof Colors;
