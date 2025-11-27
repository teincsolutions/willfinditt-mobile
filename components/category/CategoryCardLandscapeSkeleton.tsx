import { useTheme } from "@/contexts/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import AppView from "../ui/AppView";

export default function CategoryCardLandscapeSkeleton() {
  const { colors, spacing, radius } = useTheme();

  return (
    <AppView
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundGray,
          borderRadius: radius.md,
          padding: spacing.md,
        },
      ]}
    >
      {/* LEFT ICON IMAGE skeleton */}
      <AppView
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.border,
        }}
      />

      {/* TEXT CONTENT */}
      <AppView style={{ flex: 1, marginLeft: spacing.md }}>
        {/* TITLE placeholder + COUNT BADGE skeleton */}
        <AppView
          style={{
            width: 80,
            height: 20,
            backgroundColor: colors.border,
            borderRadius: 10,
            marginBottom: 4,
          }}
        />

        {/* DESCRIPTION skeleton */}
        <AppView
          style={{
            width: "70%",
            height: 14,
            backgroundColor: colors.border,
            borderRadius: 7,
          }}
        />
      </AppView>

      {/* RIGHT ARROW */}
      <Feather name="chevron-right" size={20} color={colors.border} />
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#EEE",
  },
});
