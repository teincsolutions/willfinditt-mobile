import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface BecomeSellerBannerProps {
  visible?: boolean;
  onDismiss?: () => void;
}

export default function BecomeSellerBanner({
  visible = true,
  onDismiss,
}: BecomeSellerBannerProps) {
  const { colors, spacing, radius, icons } = useTheme();

  if (!visible) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.primary + "15",
          borderColor: colors.primary,
          borderRadius: radius.md,
          padding: spacing.md,
          marginHorizontal: spacing.md,
          marginVertical: spacing.sm,
        },
      ]}
    >
      <View style={styles.content}>
        <Feather
          name="shopping-bag"
          size={20}
          color={colors.primary}
          style={{ marginTop: 2 }}
        />
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            You need to set up your seller profile to manage your ads
          </Text>
        </View>

        {onDismiss && (
          <Pressable
            onPress={onDismiss}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Feather name="x" size={icons.sm} color={colors.iconBlack} />
          </Pressable>
        )}
      </View>

      <Pressable
        onPress={() => router.push("/account/edit-business")}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: pressed ? colors.primary + "90" : colors.primary,
            borderRadius: radius.sm,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            marginTop: spacing.sm,
          },
        ]}
      >
        <Text
          style={{
            color: colors.textWhite,
            fontSize: 14,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Set Up Business
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
});
