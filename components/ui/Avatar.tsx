import { AvatarSizeKey } from "@/constants";
import { useTheme } from "@/hooks/useTheme";
import { useGetSignedUrl } from "@/hooks/useUpload";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, ImageStyle } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useEffect, useState } from "react";
import AppText from "./AppText";
import AppView from "./AppView";

interface AvatarProps {
  style?: ImageStyle;
  styleContainer?: StyleProp<ViewStyle>;
  verified?: boolean;
  uri?: string;
  size?: AvatarSizeKey;
  borderSize?: 1 | 2 | 4;
  name?: string;
  backgroundColor?: string;
  onPress?: () => void;
}

const VERIFIED_BADGE_SIZES = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
};

export function Avatar({
  style,
  styleContainer,
  verified,
  uri,
  borderSize = 2,
  backgroundColor,
  size,
  onPress,
  name,
}: AvatarProps) {
  const { colors, avatarSize } = useTheme();
  const [displayUri, setDisplayUri] = useState<string>(uri || "");
  const { mutateAsync: getSignedUrl, isPending: isGettingSignedUrl } = useGetSignedUrl();

  useEffect(() => {
    const convertToSignedUrl = async () => {
      if (uri && uri.startsWith("s3://")) {
        try {
          const signedUrl = await getSignedUrl({ url: uri });
          setDisplayUri(signedUrl);
        } catch (error) {
          console.error("Failed to get signed URL for avatar:", error);
          setDisplayUri(uri);
        }
      } else {
        setDisplayUri(uri || "");
      }
    };

    convertToSignedUrl();
  }, [uri]);

  return (
    <Pressable onPress={onPress} style={[styles.avatarWrapper, styleContainer]}>
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
            source={{ uri: displayUri || "" }}
            placeholder={require("@/assets/images/avatar-placeholder.gif")}
            placeholderContentFit="contain"
            contentFit="cover"
            style={[
              {
                width: size ? avatarSize[size] : avatarSize.lg,
                height: size ? avatarSize[size] : avatarSize.lg,
                borderRadius: size ? avatarSize[size] : avatarSize.lg,
              },
              style,
            ]}
          />
          {!displayUri && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: displayUri ? "transparent" : colors.brown,
                width: size ? avatarSize[size] : avatarSize.lg,
                height: size ? avatarSize[size] : avatarSize.lg,
              }}
            >
              <AppText
                style={{
                  fontWeight: "bold",
                  color: colors.textWhite,
                  fontSize: size ? avatarSize[size] / 2 : avatarSize.lg / 2,
                }}
              >
                {name
                  ?.split(" ")
                  .map((word) => word.charAt(0).toUpperCase())
                  .join("") || "U"}
              </AppText>
            </View>
          )}
        </AppView>
      </LinearGradient>
      {/* Verified Badge */}
      {verified && (
        <View
          style={[
            styles.badge,
            {
              top: (size ? avatarSize[size] : avatarSize.lg) / 6,
              right: -VERIFIED_BADGE_SIZES[size || "lg"] / 2.5,
            },
          ]}
        >
          <MaterialIcons
            name="verified"
            size={avatarSize[size || "lg"] / 5}
            color={colors.blue}
          />
        </View>
      )}
    </Pressable>
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
