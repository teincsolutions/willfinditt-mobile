// AppScreenWrapper.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: any;
};

export default function ScreenWrapper({ children, scroll, style }: Props) {
  const { colors } = useTheme();

  if (scroll) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
          style,
        ]}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
