import { useTheme } from "@/contexts/ThemeContext";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import PrimaryButton from "../ui/PrimaryButton";
import { TextButton } from "../ui/TextButton";

export interface SelectableListSheetRef {
  expand: () => void;
  close: () => void;
}

interface Props<T> {
  title: string;
  data: T[];
  loading?: boolean;
  snapPoints?: string[];
  onDone?: () => void;
  onClear?: () => void;
  renderItem: (params: { item: T; index: number }) => React.ReactElement | null;
  ListHeaderComponent?: React.ReactElement;
  ListHeaderComponentStyle?: StyleProp<ViewStyle>;
}

export const SelectableListSheet = forwardRef<BottomSheet, Props<any>>(
  (
    {
      title,
      data,
      loading,
      ListHeaderComponent,
      ListHeaderComponentStyle,
      snapPoints,
      onDone,
      onClear,
      renderItem,
    },
    ref
  ) => {
    const { spacing, colors } = useTheme();
    const effectiveSnapPoints = useMemo(
      () => snapPoints || ["70%"],
      [snapPoints]
    );

    const insets = useSafeAreaInsets();

    return (
      <BottomSheet
        containerStyle={{ zIndex: 1100 }}
        ref={ref}
        index={-1}
        enablePanDownToClose
        snapPoints={effectiveSnapPoints}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
            style={{ zIndex: 1100 }}
          />
        )}
        backgroundStyle={{
          backgroundColor: colors.background,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        }}
      >
        <BottomSheetView
          style={{
            paddingHorizontal: spacing.md,
            paddingBottom: insets.bottom + spacing.lg,
          }}
        >
          {/* TITLE */}
          <AppText
            variant="xl"
            style={{
              textAlign: "center",
              fontWeight: "700",
              marginBottom: spacing.md,
            }}
          >
            {title}
          </AppText>

          {/* HEADER COMPONENT */}
          {ListHeaderComponent && (
            <AppView style={ListHeaderComponentStyle}>
              {ListHeaderComponent}
            </AppView>
          )}

          {/* LIST — using BottomSheetFlatList */}
          <FlatList
            data={data}
            keyExtractor={(item: any, index: number) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            style={{ maxHeight: 600 }}
            ListFooterComponent={
              <>
                {loading && (
                  <AppView
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: spacing.md,
                    }}
                  >
                    <ActivityIndicator size="large" color={colors.primary} />
                  </AppView>
                )}
              </>
            }
          />
          {/* DONE BUTTON */}
          {onDone && (
            <AppView
              style={{
                marginTop: spacing.md,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <PrimaryButton
                style={{ flex: 1, width: "100%" }}
                title="Done"
                onPress={() => onDone()}
              />
              {onClear && (
                <TextButton
                  style={{ flex: 1 }}
                  title="Clear"
                  onPress={() => onClear()}
                />
              )}
            </AppView>
          )}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

SelectableListSheet.displayName = "SelectableListSheet";
