// HeaderBack.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "./AppText";
import IconButton from "./IconButton";

type Props = {
  onPress: () => void;
  title?: string;
};

export default function HeaderBack({ onPress, title }: Props) {
  const { spacing} = useTheme();

  return (
    <View style={[styles.row, { padding: spacing.xs }]}>
     <IconButton onPress={onPress} />

      {title && (
        <AppText variant="lg" style={styles.title}>
          {title}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  title: { marginLeft: 8 },
});
