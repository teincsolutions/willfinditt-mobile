import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet } from "react-native";
import AppView from "./AppView";
import ButtonOutline from "./ButtonOutline";

export default function BottomActionBar({
  onMessage,
  onCall,
}: {
  onMessage: () => void;
  onCall: () => void;
}) {
  const { colors, spacing } = useTheme();
  return (
    <AppView
      style={[
        styles.wrap,
        { padding: spacing.md, backgroundColor: colors.primary },
      ]}
    >
      <ButtonOutline title="Message" onPress={onMessage} />
      <ButtonOutline title="Call Seller" onPress={onCall} />
    </AppView>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", justifyContent: "space-around" },
});
