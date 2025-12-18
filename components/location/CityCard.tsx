import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { City } from "@/types/location";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface Props {
  city: City;
  selected?: boolean;
  onPress: () => void;
}

export default function CityCard({ city, selected, onPress }: Props) {
  const { colors, spacing, radius, icons, input } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed
            ? colors.backgroundGray
            : selected
            ? colors.backgroundPrimary
            : colors.inputBg,
          borderColor: selected ? colors.primary : colors.border,
          borderWidth: selected ? 2 : 1,
          height: input.height,
          borderRadius: input.radius,
          paddingHorizontal: input.paddingHorizontal,
        },
      ]}
    >
      {/* City Name */}
      <AppText
        variant="md"
        style={[
          styles.text,
          { color: selected ? colors.primary : colors.text },
        ]}
        numberOfLines={1}
      >
        {city.name}
      </AppText>

      {/* Check Icon for Selected */}
      {selected && (
        <View
          style={[
            styles.checkCircle,
            {
              backgroundColor: colors.primary,
              width: icons.md + 4,
              height: icons.md + 4,
              borderRadius: (icons.md + 4) / 2,
            },
          ]}
        >
          <Feather name="check" size={icons.sm} color={colors.textWhite} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    flex: 1,
  },
  checkCircle: {
    alignItems: "center",
    justifyContent: "center",
  },
});
