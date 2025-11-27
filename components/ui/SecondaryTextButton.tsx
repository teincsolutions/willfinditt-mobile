// SecondaryTextButton.tsx
import React from "react";
import { Pressable } from "react-native";
import AppText from "./AppText";

type Props = {
  title: string;
  underline?: boolean;
  onPress: () => void;
};

export default function SecondaryTextButton({
  title,
  underline,
  onPress,
}: Props) {
  return (
    <Pressable onPress={onPress}>
      <AppText
        variant="md"
        style={[underline && { textDecorationLine: "underline" }]}
      >
        {title}
      </AppText>
    </Pressable>
  );
}
