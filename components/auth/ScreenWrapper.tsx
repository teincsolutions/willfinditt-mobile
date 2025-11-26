// AppScreenWrapper.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
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
        showsVerticalScrollIndicator={false}
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
