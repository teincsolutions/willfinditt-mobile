import { AvatarSizeKey } from "@/constants";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, ImageStyle } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import AppView from "./AppView";

interface AvatarProps {
  style?: ImageStyle;
  styleContainer?: StyleProp<ViewStyle>;
  verified?: boolean;
  source?: { uri: string };
  size?: AvatarSizeKey;
}

export function Avatar({
  style,
  styleContainer,
  verified,
  source,
  size,
}: AvatarProps) {
  const { colors, avatarSize, icons } = useTheme();
  return (
    <AppView style={[styles.avatarWrapper, styleContainer]}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          borderRadius: size ? avatarSize[size] : avatarSize.lg,
        }}
      >
        <AppView
          style={{
            borderRadius: size ? avatarSize[size] : avatarSize.lg,
            padding: 2,
            overflow: "hidden",
            backgroundColor: colors.background,
          }}
        >
          <Image
            source={source || { uri: "https://i.pravatar.cc/200" }}
            style={[
              {
                width: size ? avatarSize[size] : avatarSize.lg,
                height: size ? avatarSize[size] : avatarSize.lg,
                borderRadius: size ? avatarSize[size] : avatarSize.lg,
              },
              style,
            ]}
          />
        </AppView>
      </LinearGradient>
      {/* Verified Badge */}
      {verified && (
        <View
          style={[
            styles.badge,
            {
              top: (size ? avatarSize[size] : avatarSize.lg) / 4,
              right: -(size ? avatarSize[size] : avatarSize.lg) / 3,
            },
          ]}
        >
          <MaterialIcons name="verified" size={icons.sm} color={colors.blue} />
        </View>
      )}
    </AppView>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
