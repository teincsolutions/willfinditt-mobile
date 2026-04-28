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

const TOOLBAR_HEIGHT = 44;
const EDITOR_MIN_HEIGHT = 100;
const EDITOR_TOTAL_HEIGHT = EDITOR_MIN_HEIGHT + TOOLBAR_HEIGHT;

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
      initialHeight = EDITOR_MIN_HEIGHT,
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
              borderColor: error ? colors.error : colors.border,
              borderRadius: radius.md,
              backgroundColor: colors.inputBg,
              overflow: "hidden",
              height: EDITOR_TOTAL_HEIGHT,
            },
            editorStyle,
          ]}
        >
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
              height: TOOLBAR_HEIGHT,
            }}
          />

          <RichEditor
            ref={editorRef}
            initialContentHTML={value}
            onChange={onChange}
            placeholder={placeholder}
            onBlur={onBlur}
            style={{
              flex: 1,
              backgroundColor: colors.inputBg,
            }}
            editorStyle={{
              backgroundColor: colors.inputBg,
              color: colors.text,
              placeholderColor: colors.placeholder,
              contentCSSText: `
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: ${fontSizes.md}px;
                color: ${colors.text};
                padding: 12px;
                margin: 0;
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