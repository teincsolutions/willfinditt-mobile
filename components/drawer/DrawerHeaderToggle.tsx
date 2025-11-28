import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import DrawerHeaderLeft from "./DrawerHeaderLeft";

export default function DrawerHeaderToggle({
  style,
}: {
  style?: StyleProp<ViewStyle>;
}) {
  const navigation = useNavigation();

  return (
    <DrawerHeaderLeft
      style={style}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    />
  );
}
