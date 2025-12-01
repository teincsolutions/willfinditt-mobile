import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { StyleProp, TextStyle } from "react-native";
import AppText from "./AppText";

export const HighlightText = ({
  text,
  query,
  style,
}: {
  text: string;
  query: string;
  style?: StyleProp<TextStyle>;
}) => {
  const { colors } = useTheme();

  if (!query)
    return (
      <AppText style={style} key="no-highlight">
        {text}
      </AppText>
    );
  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return (
    <AppText style={style}>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <AppText style={{ color: colors.primary }} key={`highlight-${index}`}>
            {part}
          </AppText>
        ) : (
          <AppText key={`normal-${index}`}>{part}</AppText>
        )
      )}
    </AppText>
  );
};
