import { useTheme } from "@/contexts/ThemeContext";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";

interface SignleAttributeProps {
  item: { label: string; value: string };
  style?: StyleProp<ViewStyle>;
}
export function SignleAttributeCard({ item, style }: SignleAttributeProps) {
  const { spacing, colors, radius } = useTheme();
  return (
    <AppView
      style={[
        styles.singleCard,
        {
          borderRadius: radius.xl,
          backgroundColor: colors.inputBg,
          borderColor: colors.border,
          padding: spacing.md,
        },
      ]}
    >
      <AppText variant="sm" style={{ opacity: 0.7 }}>
        {item.label}
      </AppText>
      <AppText variant="md" style={{ marginTop: 6 }}>
        {item.value}
      </AppText>
    </AppView>
  );
}

const styles = StyleSheet.create({
  singleCard: {
    flex: 1,
    minWidth: "48%",
    borderWidth: 1,
  },
});
