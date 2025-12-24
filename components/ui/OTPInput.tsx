// components/ui/OTPInput.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React, { useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputKeyPressEvent,
  View
} from "react-native";

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

    // Handle paste or auto-fill (multiple characters)
    if (sanitized.length > 1) {
      const pastedDigits = sanitized.slice(0, length).split("");
      const newDigits = [...digits];

      // Always start filling from the beginning for auto-fill/paste
      pastedDigits.forEach((digit, i) => {
        if (i < length) {
          newDigits[i] = digit;
        }
      });

      const completeOTP = newDigits.join("");
      onChange(completeOTP);

      // If all digits filled, trigger onComplete
      if (completeOTP.length === length && onComplete) {
        setTimeout(() => onComplete(completeOTP), 100);
      }

      // Focus the next empty field or the last field
      const nextIndex = Math.min(pastedDigits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Handle single character input
    const newDigits = [...digits];
    newDigits[index] = sanitized;
    const completeOTP = newDigits.join("");
    onChange(completeOTP);

    // Auto-focus next input if digit was entered
    if (sanitized && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (sanitized && index === length - 1 && completeOTP.length === length && onComplete) {
      // If last digit and complete, trigger onComplete
      setTimeout(() => onComplete(completeOTP), 100);
    }
  };

  const handleKeyPress = (
    e: TextInputKeyPressEvent,
    index: number
  ) => {
    if (disabled) return;

    if (e.nativeEvent.key === "Backspace") {
      if (digits[index]) {
        // If current input has a digit, clear it
        const newDigits = [...digits];
        newDigits[index] = "";
        const completeOTP = newDigits.join("");
        onChange(completeOTP);
      } else if (index > 0) {
        // If empty, move to previous input
        inputRefs.current[index - 1]?.focus();
      }
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
            maxLength={length}
            selectTextOnFocus
            editable={!disabled}
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
