import { useTheme } from "@/hooks/useTheme";
import { Category } from "@/types";
import { Image, ImageStyle } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import AppText from "../ui/AppText";
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
  const { colors, avatarSize, spacing } = useTheme();
  return (
    <AppView
      style={[styles.avatarWrapper, { gap: spacing.sm }, styleContainer]}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          borderRadius: avatarSize.lg,
        }}
      >
        <AppView
          style={{
            borderRadius: avatarSize.lg,
            padding: 2,
            overflow: "hidden",
            backgroundColor: colors.background,
          }}
        >
          <Image
            source={{ uri: category?.icon }}
            style={[
              {
                width: avatarSize.lg,
                height: avatarSize.lg,
                borderRadius: avatarSize.lg,
              },
              style,
            ]}
          />
        </AppView>
      </LinearGradient>

      <AppText
        variant="sm"
        style={{ width: avatarSize.lg, textAlign: "center" }}
        numberOfLines={2}
      >
        {category?.name}
      </AppText>
    </AppView>
  );
}
const styles = StyleSheet.create({
  avatarWrapper: {
    position: "relative",
    alignItems: "center",
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
