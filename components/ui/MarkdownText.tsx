import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Linking, Text, View } from "react-native";

type Props = {
  text: string;
  textColor?: string;
  codeBgColor?: string;
  linkColor?: string;
  style?: any;
};

// Very light-weight markdown rendering for chat:
// Supports: *bold*, _italic_, ~strike~, `code`, ```code block```, and URLs
export default function MarkdownText({
  text,
  textColor,
  codeBgColor,
  linkColor,
  style,
}: Props) {
  const { colors, spacing, fonts } = useTheme();

  const baseColor = textColor || colors.text;
  const codeBg = codeBgColor || colors.backgroundGray;
  const linkCol = linkColor || colors.blue;

  // Split by code blocks delimited by triple backticks
  const segments = text.split(/```([\s\S]*?)```/g);

  const renderInline = (t: string, keyPrefix: string) => {
    // Convert URLs first
    const parts = t.split(/(https?:\/\/[^\s]+)/g);
    return parts.map((p, idx) => {
      if (/^https?:\/\//.test(p)) {
        return (
          <Text
            key={`${keyPrefix}-link-${idx}`}
            style={{ color: linkCol, textDecorationLine: "underline" }}
            onPress={() => Linking.openURL(p)}
          >
            {p}
          </Text>
        );
      }

      // Apply inline styles: bold, italic, strike, code
      // Order matters to avoid conflicts; we process with splits and rebuild
      const tokens = tokenizeInline(p);
      return (
        <Text key={`${keyPrefix}-inline-${idx}`} style={{ color: baseColor }}>
          {tokens}
        </Text>
      );
    });
  };

  const tokenizeInline = (s: string) => {
    const result: React.ReactNode[] = [];
    // Inline code first: `code`
    const codeSplit = s.split(/`([^`]+?)`/g);
    codeSplit.forEach((chunk, i) => {
      if (i % 2 === 1) {
        result.push(
          <Text
            key={`code-${i}`}
            style={{ fontFamily: fonts.mono, backgroundColor: codeBg, paddingHorizontal: 2, borderRadius: 3 }}
          >
            {chunk}
          </Text>
        );
      } else {
        // Bold: *text*
        const boldSplit = chunk.split(/\*([^*]+?)\*/g);
        boldSplit.forEach((b, bi) => {
          if (bi % 2 === 1) {
            result.push(
              <Text key={`b-${i}-${bi}`} style={{ fontWeight: "700" }}>
                {b}
              </Text>
            );
          } else {
            // Italic: _text_
            const italicSplit = b.split(/_([^_]+?)_/g);
            italicSplit.forEach((it, ii) => {
              if (ii % 2 === 1) {
                result.push(
                  <Text key={`i-${i}-${bi}-${ii}`} style={{ fontStyle: "italic" }}>
                    {it}
                  </Text>
                );
              } else {
                // Strike: ~text~
                const strikeSplit = it.split(/~([^~]+?)~/g);
                strikeSplit.forEach((st, si) => {
                  if (si % 2 === 1) {
                    result.push(
                      <Text key={`s-${i}-${bi}-${ii}-${si}`} style={{ textDecorationLine: "line-through" }}>
                        {st}
                      </Text>
                    );
                  } else if (st) {
                    result.push(<Text key={`t-${i}-${bi}-${ii}-${si}`}>{st}</Text>);
                  }
                });
              }
            });
          }
        });
      }
    });
    return result;
  };

  return (
    <Text style={style}>
      {segments.map((seg, idx) => {
        // Odd indexes are code blocks captured by group
        if (idx % 2 === 1) {
          return (
            <View
              key={`cb-${idx}`}
              style={{
                backgroundColor: codeBg,
                padding: spacing.sm,
                borderRadius: 6,
                marginVertical: 2,
              }}
            >
              <Text style={{ fontFamily: fonts.mono, color: baseColor }}>{seg}</Text>
            </View>
          );
        }
        // Normal text with inline formatting
        return <Text key={`seg-${idx}`}>{renderInline(seg, `seg-${idx}`)}</Text>;
      })}
    </Text>
  );
}
