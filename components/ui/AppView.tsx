import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { View } from "react-native";

type Props = {
  children?: React.ReactNode;
  style?: any;
};

export default function AppView({ children, style }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[{ backgroundColor: colors.background }, style]}>
      {children}
    </View>
  );
}
