import { useTheme } from "@/contexts/ThemeContext";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import AppText from "./AppText";

interface PillProps {
  item: string;
  style?: StyleProp<ViewStyle>;
  selected?: boolean;
  onPress?: () => void;
}
export function Pill({ item, style, selected, onPress }: PillProps) {
  const { pill, colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        pill,
        { borderColor: selected ? colors.primary : colors.border },
        style,
      ]}
    >
      <AppText variant="sm">{item}</AppText>
    </Pressable>
  );
}
