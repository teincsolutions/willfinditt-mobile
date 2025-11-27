// sizing.ts
import { Radius } from "./radius";
import { Spacing } from "./spacing";
import { FontSizes } from "./typography";

export const InputSizes = {
  height: 54,
  paddingHorizontal: Spacing.md,
  gap: Spacing.sm,
  borderWidth: 1,
  radius: Radius.xxl,
};

export const InputSmSizes = {
  height: 44,
  paddingHorizontal: Spacing.sm,
  gap: Spacing.sm,
  borderWidth: 1,
  radius: Radius.xl,
};

export const ButtonSizes = {
  height: 52,
  paddingHorizontal: Spacing.lg,
  radius: Radius.xxl,
  gap: Spacing.sm,
  borderWidth: 2,
};

export const ButtonIconSizes = {
  size: 40,
  radius: 40,
};

export const ButtonTextSizes = {
  height: 40,
  paddingHorizontal: Spacing.md,
  borderRadius: Radius.xxl,
};

export const IconSizes = {
  sm: 18,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
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

export const PillSizes = {
  paddingHorizontal: Spacing.md,
  paddingVertical: Spacing.sm,
  borderRadius: Radius.xl,
  borderWidth: 1,
};
export type PillSizeKey = keyof typeof PillSizes;
