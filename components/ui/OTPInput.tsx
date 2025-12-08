// components/ui/OTPInput.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React, { useRef, useState } from "react";
import {
    NativeSyntheticEvent,
    StyleSheet,
    TextInput,
    TextInputKeyPressEventData,
    View,
} from "react-native";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
}: OTPInputProps) {
  const { colors, spacing, radius } = useTheme();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Split the value into individual digits
  const digits = value.split("");
  while (digits.length < length) {
    digits.push("");
  }

  const handleChangeText = (text: string, index: number) => {
    if (disabled) return;

    // Only allow numbers
    const sanitized = text.replace(/[^0-9]/g, "");

    // Handle paste (multiple characters)
    if (sanitized.length > 1) {
      const pastedDigits = sanitized.slice(0, length).split("");
      const newDigits = [...digits];

      pastedDigits.forEach((digit, i) => {
        if (index + i < length) {
          newDigits[index + i] = digit;
        }
      });

      onChange(newDigits.join(""));

      // Focus the next empty field or the last field
      const nextIndex = Math.min(index + pastedDigits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Handle single character input
    const newDigits = [...digits];
    newDigits[index] = sanitized;
    onChange(newDigits.join(""));

    // Auto-focus next input if digit was entered
    if (sanitized && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (disabled) return;

    // Handle backspace on empty field
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
    // Select all text when focusing (for easier editing)
    setTimeout(() => {
      inputRefs.current[index]?.setNativeProps({ selection: { start: 0, end: 1 } });
    }, 0);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => {
        const isFocused = focusedIndex === index;
        const hasValue = !!digits[index];
        const isError = error;

        return (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: isError
                  ? colors.error
                  : isFocused
                  ? colors.primary
                  : hasValue
                  ? colors.primary
                  : colors.border,
                borderWidth: isFocused || hasValue ? 2 : 1,
                borderRadius: radius.lg,
                color: colors.text,
              },
              disabled && styles.disabled,
            ]}
            value={digits[index]}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            editable={!disabled}
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  input: {
    flex: 1,
    aspectRatio: 1,
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    minWidth: 45,
    maxWidth: 65,
  },
  disabled: {
    opacity: 0.5,
  },
});
