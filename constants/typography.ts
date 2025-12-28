// typography.ts
import { Platform } from "react-native";

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
};
export type FontSizeKey = keyof typeof FontSizes;

export const FontWeights = {
  light: "300" as const,
  regular: "400" as const,
  medium: "500" as const,
  bold: "700" as const,
};
export type FontWeightKey = keyof typeof FontWeights;

export const LineHeights = {
  sm: 18,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 34,
};
export type LineHeightKey = keyof typeof LineHeights;

export const LetterSpacings = {
  sm: 0.2,
  md: 0.5,
  lg: 0.8,
  xl: 1.2,
  xxl: 1.5,
};
export type LetterSpacingKey = keyof typeof LetterSpacings;

export const Typography = {
  body: {
    fontSize: FontSizes.md,
    lineHeight: LineHeights.md,
    fontWeight: FontWeights.regular,
  },
  caption: {
    fontSize: FontSizes.sm,
    lineHeight: LineHeights.sm,
    fontWeight: FontWeights.regular,
  },
};
