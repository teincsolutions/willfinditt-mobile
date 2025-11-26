// SecondaryTextButton.tsx
import React from "react";
import { Pressable } from "react-native";
import AppText from "../ui/AppText";

type Props = {
  title: string;
  onPress: () => void;
};

export default function SecondaryTextButton({ title, onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <AppText variant="md">{title}</AppText>
    </Pressable>
  );
}
