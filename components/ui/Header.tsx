import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "./AppText";
import AppView from "./AppView";
import { BackButton } from "./BackButton";

type Props = {
  title?: React.ReactNode | React.JSX.Element | string;
  backgroundColor?: string;
  left?: React.ReactNode; // You provide your own button/component
  right?: React.ReactNode; // You provide your own button/component
  children?: React.ReactNode; // e.g. banner card or extra header content
  containerStyle?: ViewStyle;
  rightSideStyle?: ViewStyle;
  leftSideStyle?: ViewStyle;
  navRowStyle?: ViewStyle;
};

export const Header: React.FC<Props> = ({
  title,
  backgroundColor = "#FFEBD6",
  left,
  right,
  children,
  containerStyle,
  rightSideStyle,
  leftSideStyle,
  navRowStyle,
}) => {
  const insets = useSafeAreaInsets();
  const { spacing, iconButton } = useTheme();
  return (
    <AppView
      style={[
        styles.wrapper,
        { backgroundColor, paddingTop: insets.top + 10 },
        containerStyle,
      ]}
    >
      {/* Top Row (left, title, right) */}
      <AppView
        style={[
          styles.navRow,
          {
            paddingHorizontal: spacing.md,
            paddingBottom: spacing.xs,
          },
          navRowStyle,
        ]}
      >
        <AppView
          style={[
            styles.side,
            { width: iconButton.size, maxHeight: iconButton.size },
            leftSideStyle,
          ]}
        >
          {left || <BackButton />}
        </AppView>

        {typeof title === "string" ? (
          <AppText numberOfLines={1}>{title}</AppText>
        ) : title ? (
          title
        ) : (
          <AppView style={styles.placeholder} />
        )}

        <AppView
          style={[
            styles.side,
            { width: iconButton.size, maxHeight: iconButton.size },
            rightSideStyle,
          ]}
        >
          {right}
        </AppView>
      </AppView>

      {/* Custom child area (banner / card etc.) */}
      {children && (
        <AppView style={[{ marginTop: spacing.sm }]}>{children}</AppView>
      )}
    </AppView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  side: {
    alignItems: "center",
    justifyContent: "center",
  },

  placeholder: {
    flex: 1,
  },
  childrenContainer: {
    marginTop: 4,
  },
});
