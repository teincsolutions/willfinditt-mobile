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
  uri?: string;
  size?: AvatarSizeKey;
  borderSize?: 2 | 4;
  backgroundColor?: string;
}

export function Avatar({
  style,
  styleContainer,
  verified,
  uri,
  borderSize = 2,
  backgroundColor,
  size,
}: AvatarProps) {
  const { colors, avatarSize } = useTheme();
  return (
    <AppView style={[styles.avatarWrapper, styleContainer]}>
      <LinearGradient
        colors={
          backgroundColor
            ? [backgroundColor, backgroundColor]
            : [colors.primary, colors.secondary]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: size
            ? avatarSize[size] + 4 * borderSize
            : avatarSize.lg + 4 * borderSize,
          height: size
            ? avatarSize[size] + 4 * borderSize
            : avatarSize.lg + 4 * borderSize,

          borderRadius: size
            ? avatarSize[size] + 4 * borderSize
            : avatarSize.lg + 4 * borderSize,
        }}
      >
        <AppView
          style={{
            borderRadius: size ? avatarSize[size] : avatarSize.lg,
            overflow: "hidden",
            backgroundColor: colors.background,
          }}
        >
          <Image
            source={{ uri: uri || "" }}
            placeholder={require("@/assets/images/avatar-placeholder.gif")}
            placeholderContentFit="contain"
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
              top: (size ? avatarSize[size] : avatarSize.lg) / 6,
              right: -avatarSize[size || "lg"] / 18 / 2,
            },
          ]}
        >
          <MaterialIcons
            name="verified"
            size={avatarSize[size || "lg"] / 6}
            color={colors.blue}
          />
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
    alignItems: "center",
    justifyContent: "center",
  },
});
