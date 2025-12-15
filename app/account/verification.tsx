import FaceVerificationModal from "@/components/kyc/FaceVerificationModal";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { toast } from "sonner-native";

export default function BusinessScreen() {
  const { colors, spacing } = useTheme();
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [facePhotoUrls, setFacePhotoUrls] = useState<string[]>([]);

  const handleFaceVerificationComplete = (urls: string[]) => {
    console.log("Face photos uploaded successfully:", urls);
    setFacePhotoUrls(urls);

    toast.success("Face verification completed!", {
      description: `${urls.length} photos uploaded successfully`,
    });
  };

  const handleStartVerification = () => {
    Alert.alert(
      "Face Verification",
      "You will be asked to capture your face from three angles: front, left, and right. Make sure you're in a well-lit area.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Start",
          onPress: () => setShowFaceModal(true),
        },
      ]
    );
  };

  return (
    <AppView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: spacing.lg,
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: spacing.xl }}>
          <AppText variant="xxl" style={{ fontWeight: "700" }}>
            Business Verification
          </AppText>
          <AppText
            style={{
              color: colors.textGray,
              marginTop: spacing.sm,
            }}
          >
            Complete your business verification to unlock seller features
          </AppText>
        </View>

        {/* Face Verification Section */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.backgroundPrimary,
              borderRadius: spacing.md,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border,
              marginBottom: spacing.lg,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor:
                    facePhotoUrls.length > 0
                      ? colors.success + "20"
                      : colors.primary + "20",
                },
              ]}
            >
              <Ionicons
                name={facePhotoUrls.length > 0 ? "checkmark-circle" : "camera"}
                size={24}
                color={
                  facePhotoUrls.length > 0 ? colors.success : colors.primary
                }
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <AppText variant="lg" style={{ fontWeight: "600" }}>
                Face Verification
              </AppText>
              <AppText
                style={{
                  color: colors.textGray,
                  fontSize: 14,
                  marginTop: spacing.xs,
                }}
              >
                {facePhotoUrls.length > 0
                  ? "Verification photos uploaded"
                  : "Required for seller verification"}
              </AppText>
            </View>
          </View>

          {facePhotoUrls.length > 0 && (
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: colors.success + "20",
                  marginTop: spacing.md,
                  padding: spacing.sm,
                  borderRadius: spacing.sm,
                },
              ]}
            >
              <AppText
                style={{
                  color: colors.success,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                ✓ {facePhotoUrls.length} photos uploaded
              </AppText>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
                marginTop: spacing.lg,
                padding: spacing.md,
                borderRadius: spacing.md,
                alignItems: "center",
              },
            ]}
            onPress={handleStartVerification}
          >
            <AppText
              style={{
                color: colors.textWhite,
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              {facePhotoUrls.length > 0
                ? "Retake Photos"
                : "Start Face Verification"}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View
          style={[
            styles.infoBox,
            {
              backgroundColor: colors.primary + "10",
              padding: spacing.lg,
              borderRadius: spacing.md,
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
            },
          ]}
        >
          <AppText
            variant="lg"
            style={{ fontWeight: "600", marginBottom: spacing.sm }}
          >
            What to expect:
          </AppText>
          <View style={styles.bulletPoint}>
            <AppText style={{ color: colors.textGray }}>
              • You&apos;ll capture 3 photos: front, left, and right face angles
            </AppText>
          </View>
          <View style={styles.bulletPoint}>
            <AppText style={{ color: colors.textGray }}>
              • Make sure you&apos;re in a well-lit area
            </AppText>
          </View>
          <View style={styles.bulletPoint}>
            <AppText style={{ color: colors.textGray }}>
              • Follow the on-screen instructions for each pose
            </AppText>
          </View>
          <View style={styles.bulletPoint}>
            <AppText style={{ color: colors.textGray }}>
              • Photos will be automatically uploaded after capture
            </AppText>
          </View>
        </View>

        {/* Debug Info (Remove in production) */}
        {facePhotoUrls.length > 0 && (
          <View
            style={{
              marginTop: spacing.xl,
              padding: spacing.md,
              backgroundColor: colors.backgroundGray,
              borderRadius: spacing.sm,
            }}
          >
            <AppText
              style={{
                fontSize: 12,
                fontFamily: "monospace",
                color: colors.textGray,
              }}
            >
              Uploaded URLs:{"\n"}
              {facePhotoUrls.map((url, i) => `${i + 1}. ${url}`).join("\n")}
            </AppText>
          </View>
        )}
      </ScrollView>

      {/* Face Verification Modal */}
      <FaceVerificationModal
        visible={showFaceModal}
        onClose={() => setShowFaceModal(false)}
        onSuccess={handleFaceVerificationComplete}
        requireAllPoses={true}
        countdownSeconds={3}
        allowCameraSwitch={true}
      />
    </AppView>
  );
}

const styles = StyleSheet.create({
  section: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    alignSelf: "flex-start",
  },
  button: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  infoBox: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bulletPoint: {
    marginTop: 8,
  },
});
