import { useTheme } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";

export const EmptyCategoryCard = () => {
  const { colors, spacing, icons } = useTheme();

  return (
    <AppView
      style={{
        alignItems: "center",
        flex: 1,
        gap: spacing.md,
        paddingVertical: spacing.md,
      }}
    >
      <MaterialCommunityIcons
        name="package-variant-closed-remove"
        size={icons.xl}
        color={colors.iconGray}
      />
      {/* You can add a "No Categories Found" message here if needed */}
      <AppText style={{ textAlign: "center", color: colors.textGray }}>
        No Categories Found
      </AppText>
    </AppView>
  );
};
