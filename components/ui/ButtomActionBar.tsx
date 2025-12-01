import { useTheme } from "@/contexts/ThemeContext";
import { Call, Message } from "iconsax-react-nativejs";
import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import AppView from "./AppView";
import ButtonOutline from "./ButtonOutline";

export default function BottomActionBar({
  onMessage,
  onCall,
  style,
}: {
  onMessage?: () => void;
  onCall?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, spacing } = useTheme();
  return (
    <AppView
      style={[
        styles.wrap,
        { padding: spacing.md, backgroundColor: colors.primary },
        style,
      ]}
    >
      <ButtonOutline
        icon={({ color, size }) => <Message size={size} color={color} />}
        title="Message"
        onPress={onMessage}
      />
      <ButtonOutline
        icon={({ color, size }) => <Call size={size} color={color} />}
        title="Call Seller"
        onPress={onCall}
      />
    </AppView>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", justifyContent: "space-around" },
});
