// InputField.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  Modal,
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
  size?: "sm" | "md";
  onChange?: (date: Date) => void;
  onSubmit?: () => void;
  onBlur?: (e: any) => void;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string | boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  leftIconStyle?: StyleProp<ViewStyle>;
  rightIconStyle?: StyleProp<ViewStyle>;
  autoFocus?: boolean;
};

export default function DatePicker({
  label,
  value,
  size = "md",
  onChange,
  onSubmit,
  onBlur,
  placeholder,
  secure,
  keyboardType,
  leftIcon,
  rightIcon,
  rightIconStyle,
  leftIconStyle,
  error,
  style,
  autoFocus,
  inputStyle,
}: Props) {
  const { colors, icons, input, inputSmall, spacing } = useTheme();
  const [visible, setVisible] = useState(false);

  const inputSizeStyle = size === "sm" ? inputSmall : input;
  return (
    <View style={style}>
      {label && (
        <AppText variant="sm" style={{ marginBottom: spacing.sm }}>
          {label}
        </AppText>
      )}

      <Pressable
        onPress={() => setVisible(true)}
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
                onPress={() => setVisible(false)}
                icon={<Feather name="x" size={icons.md} color={colors.text} />}
              />
              <TextButton title="Done" onPress={() => setVisible(false)} />
            </AppView>

            <DateTimePicker
              value={value}
              minimumDate={new Date("1900-01-01")}
              maximumDate={new Date()}
              mode="date"
              display="inline"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  onChange && onChange(selectedDate);
                }
              }}
              style={{ backgroundColor: undefined, width: "100%" }}
              textColor={colors.text}
              accentColor={colors.primary}
            />
          </AppView>
        </AppView>
      </Modal>
    </View>
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
