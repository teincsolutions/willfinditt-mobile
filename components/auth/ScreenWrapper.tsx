// AppScreenWrapper.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
};

export default function ScreenWrapper({ children, scroll, style }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (scroll) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.container,

          { backgroundColor: colors.background, paddingBottom: insets.bottom },
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
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingBottom: insets.bottom },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
});
