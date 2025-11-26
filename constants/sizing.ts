// sizing.ts
import { Radius } from "./radius";
import { Spacing } from "./spacing";
import { FontSizes } from "./typography";

export const InputSizes = {
  height: 54,
  paddingHorizontal: Spacing.md,
  gap: Spacing.sm,
  borderWidth: 1,
  radius: Radius.md,
};

export const ButtonSizes = {
  height: 52,
  paddingHorizontal: Spacing.lg,
  radius: Radius.md,
  gap: Spacing.sm,
};

export const IconSizes = {
  sm: 18,
  md: 24,
  lg: 32,
};
export type IconSizeKey = keyof typeof IconSizes;

export const AvatarSizes = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};
export type AvatarSizeKey = keyof typeof AvatarSizes;

export const HeadingSizes = {
  h1: FontSizes.xxl,
  h2: FontSizes.xl,
  h3: FontSizes.lg,
  h4: FontSizes.md,
};
export type HeadingSizeKey = keyof typeof HeadingSizes;

export const CardSizes = {
  padding: Spacing.lg,
  radius: Radius.lg,
  gap: Spacing.md,
};
export type CardSizeKey = keyof typeof CardSizes;
