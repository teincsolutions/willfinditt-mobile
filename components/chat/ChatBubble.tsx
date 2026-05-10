import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import AppText from "../ui/AppText";
import MarkdownText from "../ui/MarkdownText";

type Props = {
  text: string;
  time?: string;
  isSender?: boolean; // true -> right (me), false -> left (other)
  side?: "left" | "right"; // deprecated: kept for backward compatibility
  isDelivered?: boolean;
  isRead?: boolean;
  attachments?: (| string
    | {
        url: string;
        mime?: string;
        width?: number;
        height?: number;
      })[];
  messageType?: "TEXT" | "IMAGE" | "FILE" | "LOCATION" | "SYSTEM";
};

export default function ChatBubble({
  text,
  time,
  isSender,
  side = "left",
  isDelivered,
  isRead,
  attachments,
  messageType,
}: Props) {
  const { colors, spacing, radius } = useTheme();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const isRight = isSender ?? side === "right";

  // Normalize attachments to handle both string arrays and object arrays
  const normalizedAttachments = attachments?.map((attachment) =>
    typeof attachment === "string"
      ? { url: attachment, mime: "image/jpeg" }
      : attachment,
  );

  const hasImages =
    normalizedAttachments &&
    normalizedAttachments.length > 0 &&
    messageType === "IMAGE";
  const hasFiles =
    normalizedAttachments &&
    normalizedAttachments.length > 0 &&
    messageType === "FILE";

  // Status indicator for sender messages
  const statusText = isRead ? (
    "✓✓"
  ) : isDelivered ? (
    "✓"
  ) : (
    <Ionicons name="time-outline" size={12} color={colors.iconWhite} />
  );
  const statusColor = isRead
    ? colors.primary
    : isRight
      ? colors.textWhite
      : colors.textGray;

  return (
    <View
      style={[
        styles.wrap,
        {
          marginVertical: spacing.sm,
          alignItems: isRight ? "flex-end" : undefined,
          paddingLeft: isRight ? "20%" : 0,
          paddingRight: !isRight ? "20%" : 0,
        },
      ]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isRight
              ? colors.primary
              : colors.backgroundPrimary,
            padding: hasImages ? spacing.xs : spacing.md,
            borderTopEndRadius: radius.lg,
            borderTopStartRadius: radius.lg,
            borderBottomRightRadius: isRight ? undefined : radius.lg,
            borderBottomLeftRadius: !isRight ? undefined : radius.lg,
            marginHorizontal: spacing.md,
          },
        ]}
      >
        {/* Render images if present */}
        {hasImages &&
          normalizedAttachments.map((attachment, index) => {
            // Skip rendering if URL is still an S3 URL (waiting for signed URL)
            const isS3Url = attachment.url.startsWith("s3://");

            if (isS3Url) {
              return (
                <View
                  key={index}
                  style={[
                    styles.imageError,
                    {
                      backgroundColor: colors.background,
                      borderRadius: radius.md,
                      marginBottom: text ? spacing.sm : 0,
                    },
                  ]}
                >
                  <ActivityIndicator size="small" color={colors.primary} />
                  <AppText
                    variant="sm"
                    style={{ color: colors.textGray, marginTop: spacing.xs }}
                  >
                    Loading image...
                  </AppText>
                </View>
              );
            }

            return (
              <Pressable
                key={index}
                onPress={() => {
                  // Open image in full screen or external viewer
                  Linking.openURL(attachment.url).catch((err) =>
                    console.error("Failed to open image:", err),
                  );
                }}
                style={{ marginBottom: text ? spacing.sm : 0 }}
              >
                <View style={styles.imageContainer}>
                  {imageLoading && !imageError && (
                    <View
                      style={[
                        styles.imageLoader,
                        { backgroundColor: colors.background },
                      ]}
                    >
                      <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                  )}
                  {imageError ? (
                    <View
                      style={[
                        styles.imageError,
                        { backgroundColor: colors.background },
                      ]}
                    >
                      <Ionicons
                        name="image-outline"
                        size={48}
                        color={colors.iconGray}
                      />
                      <AppText
                        variant="sm"
                        style={{
                          color: colors.textGray,
                          marginTop: spacing.xs,
                        }}
                      >
                        Failed to load image
                      </AppText>
                    </View>
                  ) : (
                    <Image
                      source={{ uri: attachment.url }}
                      style={[
                        styles.image,
                        {
                          borderRadius: radius.md,
                          width:
                            attachment.width && attachment.width < 250
                              ? attachment.width
                              : 250,
                          height:
                            attachment.height && attachment.height < 250
                              ? attachment.height
                              : 250,
                        },
                      ]}
                      resizeMode="cover"
                      onLoadStart={() => setImageLoading(true)}
                      onLoadEnd={() => setImageLoading(false)}
                      onError={() => {
                        setImageLoading(false);
                        setImageError(true);
                      }}
                    />
                  )}
                </View>
              </Pressable>
            );
          })}

        {/* Render file attachments if present */}
        {hasFiles &&
          normalizedAttachments.map((attachment, index) => {
            const isS3Url = attachment.url.startsWith("s3://");

            return (
              <Pressable
                key={index}
                onPress={() => {
                  if (!isS3Url) {
                    Linking.openURL(attachment.url).catch((err) =>
                      console.error("Failed to open file:", err),
                    );
                  }
                }}
                disabled={isS3Url}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: spacing.sm,
                  backgroundColor: isRight ? colors.primary : colors.background,
                  borderRadius: radius.md,
                  marginBottom: text ? spacing.sm : 0,
                  opacity: isS3Url ? 0.6 : 1,
                }}
              >
                {isS3Url ? (
                  <ActivityIndicator
                    size="small"
                    color={isRight ? colors.iconWhite : colors.primary}
                  />
                ) : (
                  <Ionicons
                    name="document-outline"
                    size={24}
                    color={isRight ? colors.iconWhite : colors.iconGray}
                  />
                )}
                <AppText
                  variant="sm"
                  style={{
                    color: isRight ? colors.textWhite : colors.text,
                    marginLeft: spacing.sm,
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {isS3Url ? "Loading file..." : "Tap to view file"}
                </AppText>
              </Pressable>
            );
          })}

        {/* Render text if present */}
        {text ? (
          <View style={{ padding: hasImages || hasFiles ? spacing.sm : 0 }}>
            <MarkdownText
              text={text}
              textColor={isRight ? colors.textWhite : colors.textGray}
              style={{ color: isRight ? colors.textWhite : colors.textGray }}
            />
          </View>
        ) : null}

        {time ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              marginTop: spacing.xs,
            }}
          >
            <AppText
              variant="xs"
              style={[
                styles.time,
                { color: isRight ? colors.textWhite : colors.textGray },
              ]}
            >
              {time}
            </AppText>

            {/* Status indicator shown for sender messages */}
            {isRight ? (
              <AppText
                variant="xs"
                style={{
                  marginLeft: spacing.xs,
                  color: statusColor,
                }}
              >
                {statusText}
              </AppText>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  bubble: { maxWidth: "88%" },
  time: { alignSelf: "flex-end" },
  imageContainer: {
    position: "relative",
    overflow: "hidden",
  },
  image: {
    minWidth: 150,
    minHeight: 150,
  },
  imageLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  imageError: {
    minWidth: 150,
    minHeight: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
});
