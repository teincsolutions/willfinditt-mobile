// InputField.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { Feather } from "@expo/vector-icons";
import RNDatePicker from 'react-native-date-picker';

import { format } from "date-fns";
import React from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";
import AppView from "./AppView";
import IconButton from "./IconButton";
import { TextButton } from "./TextButton";

type Props = {
  label?: string;
  value: Date;
  visible: boolean;
  size?: "sm" | "md";
  onChange?: (date: Date) => void;
  onClose?: () => void;
  onOpen?: () => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string | boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  leftIconStyle?: StyleProp<ViewStyle>;
  rightIconStyle?: StyleProp<ViewStyle>;
};

export default function DatePicker({
  label,
  value,
  visible,
  size = "md",
  onChange,
  placeholder,
  leftIcon,
  rightIcon,
  rightIconStyle,
  leftIconStyle,
  style,
  onClose,
  onOpen,
  inputStyle,
}: Props) {
  const { colors, icons, input, inputSmall, spacing } = useTheme();

  const inputSizeStyle = size === "sm" ? inputSmall : input;
  return (
    <AppView style={style}>
      {label && (
        <AppText variant="sm" style={{ marginBottom: spacing.sm }}>
          {label}
        </AppText>
      )}

      <Pressable
        onPress={onOpen}
        style={[
          styles.container,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
            height: inputSizeStyle.height,
            borderRadius: inputSizeStyle.radius,
            paddingHorizontal: inputSizeStyle.paddingHorizontal,
          },
          inputStyle,
        ]}
      >
        {leftIcon && (
          <View style={[{ marginRight: spacing.sm }, leftIconStyle]}>
            {leftIcon}
          </View>
        )}
        <AppText
          variant="md"
          style={[
            styles.input,
            { color: value ? colors.text : colors.placeholder },
          ]}
        >
          {(value && format(value, "d MMMM, yyyy")) || placeholder}
        </AppText>
        {rightIcon && (
          <View style={[{ marginLeft: spacing.sm }, rightIconStyle]}>
            {rightIcon}
          </View>
        )}
      </Pressable>

      {Platform.OS === "ios" ? (
        <Modal animationType="slide" transparent visible={visible}>
          <AppView
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <AppView
              style={{
                justifyContent: "center",
                padding: spacing.md,
                backgroundColor: colors.inputBg,
                borderRadius: inputSizeStyle.radius,
              }}
            >
              <AppView
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <IconButton
                  style={{ backgroundColor: colors.inputBg }}
                  onPress={() => onClose && onClose()}
                  icon={
                    <Feather name="x" size={icons.md} color={colors.text} />
                  }
                />
                <TextButton title="Done" onPress={() => onClose && onClose()} />
              </AppView>

              
            </AppView>
          </AppView>
        </Modal>
      ) : (
        <RNDatePicker
          mode="date"
          
          open={visible}
          date={value || new Date("1900-01-01")}
          minimumDate={new Date("1900-01-01")}
          maximumDate={new Date()}
          onDateChange={(selectedDate) => {
            if (selectedDate) {
              onChange && onChange(selectedDate);
            }
          }}
          style={{ backgroundColor: colors.inputBg }}
        />
      )}
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  input: { flex: 1 },
});
