// components/Drawer/DrawerMenuItem.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
} from "react-native";
import AppText from "../ui/AppText";
import Badge from "../ui/Badge";

export default function DrawerMenuItem({
  icon,
  label,
  active,
  onPress,
  count,
  labelStyle,
}: {
  icon?: ({ active }: { active?: boolean }) => React.ReactNode;
  label: string;
  onPress: () => void;
  active?: boolean;
  count?: number;
  labelStyle?: StyleProp<TextStyle>;
}) {
  const { colors, spacing, radius, button } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.item,
        {
          backgroundColor: active ? colors.primary : colors.inputBg,
          borderRadius: radius.xxl,
          borderColor: active ? colors.primary : colors.border,
          borderWidth: button.borderWidth,
          height: button.height,
          justifyContent: "center",
          paddingHorizontal: spacing.md,
          marginBottom: spacing.md,
        },
      ]}
    >
      <View style={styles.row}>
        {icon && icon({ active })}
        <AppText
          style={[
            {
              marginLeft: spacing.md,
              flex: 1,
              color: active ? colors.textWhite : colors.text,
            },
            labelStyle,
          ]}
        >
          {label}
        </AppText>
        {count ? <Badge count={count} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
