import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import IconButton from "../ui/IconButton";
import PlaceholderField from "../ui/PlaceholderField";

export function LocationSheetButton({ onPress }: { onPress?: () => void }) {
  const { spacing, radius, icons, colors } = useTheme();

  return (
    <PlaceholderField
      onPress={onPress}
      placeholder={"Select a location"}
      label={"Location"}
      inputStyle={[
        {
          borderRadius: radius.sm,
          backgroundColor: colors.selectBg,
          paddingRight: spacing.sm,
        },
      ]}
      value={""}
      rightIcon={
        <IconButton
          onPress={onPress}
          style={{
            backgroundColor: colors.iconLightGray,
            borderRadius: radius.sm,
          }}
          icon={
            <Feather
              name="chevron-down"
              size={icons.sm}
              color={colors.iconGray}
            />
          }
        />
      }
    />
  );
}
