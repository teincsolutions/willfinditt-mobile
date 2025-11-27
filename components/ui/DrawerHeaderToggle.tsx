import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import DrawerHeaderLeft from "./DrawerHeaderLeft";

export default function DrawerHeaderToggle() {
  const navigation = useNavigation();

  return (
    <DrawerHeaderLeft
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    />
  );
}
