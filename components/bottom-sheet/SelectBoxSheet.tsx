import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SearchBar } from "../search/SearchBar";
import IconButton from "../ui/IconButton";
import PlaceholderField from "../ui/PlaceholderField";
import { SelectableListSheet } from "./SelectableBottomSheet";

export function SelectBoxSheet<T>({
  label,
  placeholder,
  searchPlaceholder,
  style,
  searchable,
  value,
  title,
  data,
  loading,
  getValue,
  onDone,
  renderItem,
}: {
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  value?: string | number | null;
  searchable?: boolean;
  style?: StyleProp<ViewStyle>;
  title: string;
  data: T[];
  loading?: boolean;
  onDone?: () => void;
  getValue?: (item: T) => string;
  renderItem: (params: { item: T; index: number }) => React.ReactElement | null;
}) {
  const { spacing, radius, icons, colors } = useTheme();
  const sheetRef = useRef<BottomSheet>(null);
  const [searchValue, setSearchValue] = React.useState("");
  return (
    <>
      <PlaceholderField
        onPress={() => sheetRef.current?.expand()}
        placeholder={placeholder || `Search...`}
        label={label}
        inputStyle={[
          {
            borderRadius: radius.sm,
            backgroundColor: colors.selectBg,
            paddingRight: spacing.sm,
          },
        ]}
        style={style}
        value={String(
          getValue
            ? getValue(data.find((item) => getValue(item) === value)!)
            : value
        )}
        rightIcon={
          <IconButton
            onPress={() => sheetRef.current?.expand()}
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

      <SelectableListSheet
        ListHeaderComponent={
          searchable ? (
            <SearchBar
              value={searchValue}
              placeholder={searchPlaceholder}
              onChangeText={setSearchValue}
            />
          ) : undefined
        }
        ListHeaderComponentStyle={{
          marginBottom: spacing.md,
        }}
        ref={sheetRef}
        title={title}
        data={data}
        loading={loading}
        onDone={onDone}
        renderItem={renderItem}
      />
    </>
  );
}
