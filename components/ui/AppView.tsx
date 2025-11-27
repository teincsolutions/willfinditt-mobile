import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function AppView({ children, style }: Props) {
  return <View style={[style]}>{children}</View>;
}
