import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "@/contexts/ThemeContext";
import { useUploadAvatar } from "@/hooks/useUpload";
import { Avatar } from "@/components/ui/Avatar";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { forwardRef, useMemo, useState } from "react";
import { Image, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import AppText from "./AppText";
import AppView from "./AppView";
import PrimaryButton from "./PrimaryButton";

export interface AvatarPickerSheetProps {
  currentAvatar?: string;
  onUploadSuccess: (avatarUrl: string) => void;
  userName?: string;
  isVerified?: boolean;
}

export const AvatarPickerSheet = forwardRef<
  BottomSheet,
  AvatarPickerSheetProps
>(({ currentAvatar, onUploadSuccess, userName = "User", isVerified }, ref) => {
  const { spacing, colors, icons, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { mutateAsync: uploadAvatar, isPending: isUploading } =
    useUploadAvatar();

  const snapPoints = useMemo(() => ["55%"], []);

  const pickImageFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        toast.error("Please grant gallery access to select images");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image from gallery:", error);
      toast.error("Failed to select image");
    }
  };

  const takePhotoFromCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        toast.error("Please grant camera access to take photos");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      toast.error("Failed to take photo");
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    try {
      const formData = new FormData();
      const filename = selectedImage.split("/").pop() || `avatar_${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("avatar", {
        uri: selectedImage,
        name: filename,
        type,
      } as any);

      const response = await uploadAvatar(formData);

      console.log("Upload response:", JSON.stringify(response, null, 2));

      const s3Url = response.url || response.urls?.[0] || response.thumbnail;

      if (s3Url) {
        onUploadSuccess(s3Url);
        toast.success("Profile picture updated successfully");
        setSelectedImage(null);
        if (ref && "current" in ref && ref.current) {
          ref.current.close();
        }
      } else {
        console.error("No URL in upload response:", response);
        toast.error("Failed to get uploaded image URL");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload profile picture"
      );
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      index={-1}
      enablePanDownToClose
      onClose={handleClose}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      )}
      backgroundStyle={{
        backgroundColor: colors.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
      }}
    >
      <BottomSheetView
        style={{
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          paddingBottom: insets.bottom + spacing.md,
          gap: spacing.md,
        }}
      >
        <AppText
          variant="xl"
          style={{ textAlign: "center", marginBottom: spacing.sm }}
        >
          Change Profile Picture
        </AppText>

        <AppText
          variant="sm"
          style={{
            textAlign: "center",
            opacity: 0.7,
            marginBottom: spacing.lg,
          }}
        >
          Select a photo from your gallery or take a new one
        </AppText>

        <AppView
          style={{
            alignItems: "center",
            paddingVertical: spacing.lg,
          }}
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
              }}
            />
          ) : (
            <Avatar
              size="xxl"
              uri={currentAvatar}
              name={userName}
              verified={isVerified}
            />
          )}
        </AppView>

        {!selectedImage && (
          <AppView style={{ gap: spacing.sm }}>
            <Pressable
              onPress={pickImageFromGallery}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: spacing.md,
                backgroundColor: colors.backgroundSecondary,
                borderRadius: radius.md,
                gap: spacing.md,
              }}
            >
              <Feather
                name="image"
                size={icons.lg}
                color={colors.primary}
              />
              <AppText variant="md">Choose from Gallery</AppText>
            </Pressable>

            <Pressable
              onPress={takePhotoFromCamera}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: spacing.md,
                backgroundColor: colors.backgroundSecondary,
                borderRadius: radius.md,
                gap: spacing.md,
              }}
            >
              <Feather
                name="camera"
                size={icons.lg}
                color={colors.primary}
              />
              <AppText variant="md">Take a Photo</AppText>
            </Pressable>
          </AppView>
        )}

        {selectedImage && (
          <AppView style={{ gap: spacing.sm }}>
            <PrimaryButton
              title={isUploading ? "Uploading..." : "Upload Photo"}
              onPress={handleUpload}
              disabled={isUploading}
              style={{}}
            />

            <Pressable
              onPress={() => setSelectedImage(null)}
              style={{
                padding: spacing.md,
                backgroundColor: colors.backgroundSecondary,
                borderRadius: radius.md,
                alignItems: "center",
              }}
            >
              <AppText variant="md" style={{ color: colors.text }}>
                Choose Different Photo
              </AppText>
            </Pressable>
          </AppView>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
});

AvatarPickerSheet.displayName = "AvatarPickerSheet";
