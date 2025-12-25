import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Platform, Text } from "react-native";
import { CodeField, Cursor } from "react-native-confirmation-code-field";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
  onComplete?: (otp: string) => void;
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
  onComplete,
}: OTPInputProps) {
  const { colors, radius } = useTheme();

  const handleChange = (text: string) => {
    onChange(text);
    if (text.length === length && onComplete) {
      onComplete(text);
    }
  };

  const cellStyle = {
    width: 50,
    height: 50,
    lineHeight: 48,
    fontSize: 24,
    fontWeight: "600" as const,
    borderWidth: 1,
    borderColor: error ? colors.error : colors.border,
    textAlign: "center" as const,
    color: colors.text,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
  };

  const focusCellStyle = {
    ...cellStyle,
    borderColor: colors.primary,
    borderWidth: 2,
  };

  const filledCellStyle = {
    ...cellStyle,
    borderColor: colors.primary,
    borderWidth: 2,
  };

  return (
    <CodeField
      value={value}
      onChangeText={handleChange}
      cellCount={length}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
      renderCell={({ index, symbol, isFocused }) => (
        <Text
          key={index}
          style={
            isFocused
              ? focusCellStyle
              : symbol
              ? filledCellStyle
              : cellStyle
          }
        >
          {symbol || (isFocused ? <Cursor /> : null)}
        </Text>
      )}
    />
  );
}
