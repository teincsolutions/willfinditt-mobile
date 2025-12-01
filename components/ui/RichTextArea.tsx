import { useTheme } from "@/hooks/useTheme";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import {
    RichEditor,
    RichToolbar,
    actions,
} from "react-native-pell-rich-editor";
import AppText from "./AppText";

type Props = {
  label?: string;
  value?: string;
  placeholder?: string;
  error?: string | boolean;
  style?: StyleProp<ViewStyle>;
  editorStyle?: StyleProp<ViewStyle>;
  onChange?: (html: string) => void;
  onBlur?: () => void;
  initialHeight?: number;
};

const RichTextArea = forwardRef<RichEditor, Props>(
  (
    {
      label,
      value,
      placeholder = "Enter text here...",
      error,
      style,
      editorStyle,
      onChange,
      onBlur,
      initialHeight = 200,
    },
    ref
  ) => {
    const { colors, spacing, radius, fontSizes } = useTheme();
    const editorRef = useRef<RichEditor>(null);

    useImperativeHandle(ref, () => editorRef.current as RichEditor)

    return (
      <View style={style}>
        {label && (
          <AppText variant="sm" style={{ marginBottom: spacing.sm }}>
            {label}
          </AppText>
        )}

        <View
          style={[
            {
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radius.md,
              backgroundColor: colors.inputBg,
              overflow: "hidden",
            },
            editorStyle,
          ]}
        >
          {/* Toolbar */}
          <RichToolbar
            editor={editorRef}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.alignLeft,
              actions.alignCenter,
              actions.alignRight,
              actions.undo,
              actions.redo,
            ]}
            iconTint={colors.text}
            selectedIconTint={colors.primary}
            disabledIconTint={colors.placeholder}
            style={{
              backgroundColor: colors.backgroundPrimary,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              minHeight: 50,
            }}
          />

          {/* Editor */}
          <RichEditor
            ref={editorRef}
            initialContentHTML={value}
            onChange={onChange}
            placeholder={placeholder}
            onBlur={onBlur}
            style={{
              minHeight: initialHeight,
              backgroundColor: colors.inputBg,
            }}
            editorStyle={{
              backgroundColor: colors.inputBg,
              color: colors.text,
              placeholderColor: colors.placeholder,
              contentCSSText: `
                font-size: ${fontSizes.md}px;
                color: ${colors.text};
                padding: ${spacing.md}px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              `,
            }}
            useContainer={true}
          />
        </View>

        {error && (
          <AppText
            variant="sm"
            style={{ color: colors.error, marginTop: spacing.xs }}
          >
            {error}
          </AppText>
        )}
      </View>
    );
  }
);

RichTextArea.displayName = "RichTextArea";

export default RichTextArea;
