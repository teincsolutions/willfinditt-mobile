import { useTheme } from "@/hooks/useTheme";
import { Category } from "@/types";
import { Image, ImageStyle } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import AppView from "../ui/AppView";

interface CategoryCardCircularProps {
  style?: ImageStyle;
  styleContainer?: StyleProp<ViewStyle>;
  category?: Category;
}

export function CategoryCardCircular({
  style,
  styleContainer,
  category,
}: CategoryCardCircularProps) {
  const { colors, avatarSize } = useTheme();
  return (
    <AppView style={[styles.avatarWrapper, styleContainer]}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          borderRadius: avatarSize.xl,
        }}
      >
        <AppView
          style={{
            borderRadius: avatarSize.xl,
            padding: 2,
            overflow: "hidden",
            backgroundColor: colors.background,
          }}
        >
          <Image
            source={{ uri: category?.icon }}
            style={[
              {
                width: avatarSize.xl,
                height: avatarSize.xl,
                borderRadius: avatarSize.xl,
              },
              style,
            ]}
          />
        </AppView>
      </LinearGradient>
    </AppView>
  );
}

interface CategoryCardCircularSkeletonProps {
  styleContainer?: StyleProp<ViewStyle>;
}

export function CategoryCardCircularSkeleton({
  styleContainer,
}: CategoryCardCircularSkeletonProps) {
  const { colors, avatarSize } = useTheme();
  return (
    <AppView style={[styles.avatarWrapper, styleContainer]}>
      <AppView
        style={[
          {
            width: avatarSize.xl + 4,
            height: avatarSize.xl + 4,
            borderRadius: avatarSize.xl + 2,
            padding: 2,
            backgroundColor: colors.border,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <AppView
          style={{
            width: avatarSize.xl,
            height: avatarSize.xl,
            borderRadius: avatarSize.xl,
            backgroundColor: colors.backgroundGray,
          }}
        />
      </AppView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
