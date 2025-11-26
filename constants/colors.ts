// colors.ts
export const Colors = {
  light: {
    background: "#FFFFFF",
    text: "#1A1A1A",
    primary: "#EF702A",
    secondary: "#FFCB11",
    acent: "#FFCB11",
    inputBg: "#F7F7F7",
    border: "#E3E3E3",
    error: "#FF4D4D",
  },

  dark: {
    background: "#000000",
    text: "#FFFFFF",
    primary: "#FF823A", // Enhanced orange for dark mode
    secondary: "#FFD84A", // Enhanced yellow for dark mode
    acent: "#FFD84A", // Added accent color for dark mode
    inputBg: "#1A1A1A",
    border: "#333333",
    error: "#FF6B6B",
  },
};

export type ThemeMode = keyof typeof Colors;
