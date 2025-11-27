import { useTheme } from "@/contexts/ThemeContext";
import { StyleProp, ViewStyle } from "react-native";
import AppText from "./AppText";
import AppView from "./AppView";

interface PillProps {
  item: string;
  style?: StyleProp<ViewStyle>;
}
export function Pill({ item, style }: PillProps) {
  const { pill, colors } = useTheme();
  return (
    <AppView style={[pill, { borderColor: colors.border }, style]}>
      <AppText variant="sm">{item}</AppText>
    </AppView>
  );
}
