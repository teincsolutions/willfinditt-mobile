import { useTheme } from "@/hooks/useTheme";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import AppView from "../ui/AppView";

interface CategoryCardCircularSkeletonProps {
  styleContainer?: StyleProp<ViewStyle>;
}

export function CategoryCardCircularSkeleton({
  styleContainer,
}: CategoryCardCircularSkeletonProps) {
  const { colors, avatarSize } = useTheme();
  return (
    <AppView style={[styles.avatarWrapper, styleContainer]}>
      <View
        style={[
          {
            width: avatarSize.xl + 4,
            height: avatarSize.xl + 4,
            borderRadius: avatarSize.xl + 2,
            padding: 2,
            backgroundColor: colors.background,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <View
          style={{
            width: avatarSize.xl,
            height: avatarSize.xl,
            borderRadius: avatarSize.xl,
            backgroundColor: colors.backgroundGray,
          }}
        />
      </View>
    </AppView>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    position: "relative",
  },
});
