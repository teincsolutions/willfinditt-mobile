// components/home/HomeSectionHeader.tsx
import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { DirectDown, DirectUp } from "iconsax-react-nativejs";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { TextButton } from "../ui/TextButton";

export default function SectionHeader({
  title,
  style,
  showAll,
  onPress,
}: {
  title: string;
  style?: StyleProp<ViewStyle>;
  showAll?: boolean;
  onPress: (showAll: boolean) => void;
}) {
  const { spacing, colors, icons } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: spacing.lg,
          marginTop: spacing.lg,
        },
        style,
      ]}
    >
      <AppText variant="lg" style={{ fontWeight: "bold" }}>
        {title}
      </AppText>
      {showAll ? (
        <TextButton
          icon={
            <DirectUp variant="Bold" color={colors.iconBlack} size={icons.sm} />
          }
          onPress={() => onPress(true)}
          title="See fewer"
        />
      ) : (
        <TextButton
          icon={
            <DirectDown
              variant="Bold"
              color={colors.iconBlack}
              size={icons.sm}
            />
          }
          onPress={() => onPress(false)}
          title="See all"
        />
      )}
    </View>
  );
}
