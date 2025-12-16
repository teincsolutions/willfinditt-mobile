import DocumentUploadModal from "@/components/kyc/DocumentUploadModal";
import FaceVerificationModal from "@/components/kyc/FaceVerificationModal";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { BackButton } from "@/components/ui/BackButton";
import { Header } from "@/components/ui/Header";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useAuth } from "@/hooks/useAuth";
import { useMySeller } from "@/hooks/useSeller";
import { useTheme } from "@/hooks/useTheme";
import { DocumentType } from "@/types/enums";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function VerificationScreen() {
  const { colors, spacing, icons } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { submitVerificationAsync, isSubmittingVerification } = useMySeller();

  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [documentData, setDocumentData] = useState<{
    documentType: DocumentType;
    documentNumber: string;
    fullName?: string;
    documentIssueDate?: string;
    documentExpiryDate?: string;
    address: string;
    documents: string[];
    additionalNotes?: string;
  } | null>(null);

  const sellerProfile = user?.sellerProfile;

  const handleDocumentUploadComplete = (data: typeof documentData) => {
    console.log("Documents uploaded successfully:", data);
    setDocumentData(data);
    // Show face verification modal after document upload
    setShowFaceModal(true);
  };

  const handleFaceVerificationComplete = async (facePhotoUrls: string[]) => {
    console.log("Face photos uploaded successfully:", facePhotoUrls);

    if (!documentData) {
      toast.error("Document data is missing. Please start again.");
      return;
    }

    if (!sellerProfile?.id) {
      toast.error("Seller profile not found. Please create one first.");
      return;
    }

    try {
      // Submit verification request
      const verificationData = {
        sellerProfileId: sellerProfile.id,
        documentType: documentData.documentType,
        documentNumber: documentData.documentNumber,
        fullName: documentData.fullName,
        documentIssueDate: documentData.documentIssueDate,
        documentExpiryDate: documentData.documentExpiryDate,
        address: documentData.address,
        documents: documentData.documents,
        facePhoto: facePhotoUrls,
        additionalNotes: documentData.additionalNotes,
      };

      await submitVerificationAsync(verificationData);

      toast.success("Verification submitted successfully!", {
        description: "Your verification request is now under review.",
      });

      // Reset state
      setDocumentData(null);

      // Navigate back to business profile
      router.push("/account/business");
    } catch (error: any) {
      console.error("Verification submission error:", error);
      toast.error(error?.message || "Failed to submit verification");
    }
  };

  if (isAuthLoading) {
    return (
      <AppView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </AppView>
    );
  }

  if (!sellerProfile) {
    return (
      <AppView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: spacing.xl,
        }}
      >
        <Stack.Screen
          options={{
            header: () => <Header left={<BackButton />} title="Verification" />,
          }}
        />
        <AppText
          variant="lg"
          style={{ textAlign: "center", marginBottom: spacing.md }}
        >
          No Seller Profile Found
        </AppText>
        <AppText style={{ textAlign: "center", color: colors.textGray }}>
          You need to create a business profile before you can submit a
          verification request.
        </AppText>
        <PrimaryButton
          title="Create Business Profile"
          onPress={() => router.push("/account/edit-business")}
          style={{ marginTop: spacing.lg }}
        />
      </AppView>
    );
  }

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          header: () => <Header left={<BackButton />} title="Verification" />,
        }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: insets.bottom + 100,
        }}
      >
        {/* Verification Status */}
        {sellerProfile.verification && (
          <AppView
            style={{
              padding: spacing.md,
              backgroundColor:
                sellerProfile.verification.status === "APPROVED"
                  ? colors.successLight
                  : sellerProfile.verification.status === "REJECTED"
                  ? colors.errorLight
                  : colors.warningLight,
              borderRadius: spacing.sm,
              marginBottom: spacing.lg,
            }}
          >
            <AppText
              variant="md"
              style={{
                fontWeight: "600",
                color:
                  sellerProfile.verification.status === "APPROVED"
                    ? colors.success
                    : sellerProfile.verification.status === "REJECTED"
                    ? colors.error
                    : colors.warning,
              }}
            >
              {sellerProfile.verification.status === "APPROVED"
                ? "✓ Verification Approved"
                : sellerProfile.verification.status === "REJECTED"
                ? "✗ Verification Rejected"
                : "⏳ Verification Pending"}
            </AppText>
            <AppText
              variant="sm"
              style={{
                marginTop: spacing.xs,
                color: colors.textGray,
              }}
            >
              {sellerProfile.verification.status === "APPROVED"
                ? "Your identity has been verified successfully."
                : sellerProfile.verification.status === "REJECTED"
                ? `Reason: ${
                    sellerProfile.verification.rejectionReason ||
                    "Please contact support."
                  }`
                : "Your verification request is under review. This may take 1-3 business days."}
            </AppText>
          </AppView>
        )}

        {/* Section: Verification Instructions */}
        <View style={[{ flex: 1, padding: spacing.md }]}>
          <View style={[{ gap: spacing.md, alignItems: "center" }]}>
            <Image
              source={require("@/assets/images/face-scan.svg")}
              style={{ width: 164, height: 164 }}
            />
            <AppText
              variant="xl"
              style={{
                fontWeight: "600",
                marginLeft: spacing.md,
              }}
            >
              Identity Verification
            </AppText>
            <AppText style={{ textAlign: "center", color: colors.textGray }}>
              To verify your identity and become a verified seller, you need to:
            </AppText>

            <AppView
              style={{
                width: "100%",
                gap: spacing.md,
                paddingHorizontal: spacing.md,
              }}
            >
              <AppView style={{ flexDirection: "row", gap: spacing.sm }}>
                <AppText style={{ fontWeight: "600" }}>1.</AppText>
                <AppText style={{ flex: 1 }}>
                  Upload clear photos of your identification document (National
                  ID, Driver&apos;s License, or Passport)
                </AppText>
              </AppView>
              <AppView style={{ flexDirection: "row", gap: spacing.sm }}>
                <AppText style={{ fontWeight: "600" }}>2.</AppText>
                <AppText style={{ flex: 1 }}>
                  Complete face verification by capturing photos from three
                  angles: front, left, and right
                </AppText>
              </AppView>
            </AppView>

            <AppView
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: spacing.lg,
              }}
            >
              <AppView
                style={{ width: "30%", alignItems: "center", gap: spacing.sm }}
              >
                <Image
                  source={require("@/assets/icons/hold-phone.png")}
                  contentFit="contain"
                  style={{ width: icons.xxl, height: icons.xxl }}
                />
                <AppText style={{ textAlign: "center", fontSize: 12 }}>
                  Hold your device at eye level
                </AppText>
              </AppView>
              <AppView
                style={{ width: "30%", alignItems: "center", gap: spacing.sm }}
              >
                <Image
                  source={require("@/assets/icons/well-lit.png")}
                  contentFit="contain"
                  style={{ width: icons.xxl, height: icons.xxl }}
                />
                <AppText style={{ textAlign: "center", fontSize: 12 }}>
                  Use well lit area
                </AppText>
              </AppView>

              <AppView
                style={{ width: "30%", alignItems: "center", gap: spacing.sm }}
              >
                <Image
                  source={require("@/assets/icons/no-glasses.png")}
                  contentFit="contain"
                  style={{ width: icons.xxl, height: icons.xxl }}
                />
                <AppText style={{ textAlign: "center", fontSize: 12 }}>
                  No glasses or hats
                </AppText>
              </AppView>
            </AppView>
          </View>
        </View>
      </ScrollView>

      <AppView
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: spacing.md,
          paddingBottom: insets.bottom + spacing.md,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <PrimaryButton
          backgroundColor={colors.primary}
          title={
            isSubmittingVerification
              ? "Submitting..."
              : sellerProfile.verification
              ? "Re-submit Verification"
              : "Start Verification"
          }
          onPress={() => setShowDocumentModal(true)}
          disabled={
            isSubmittingVerification ||
            sellerProfile.verification?.status === "PENDING"
          }
        />
      </AppView>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        visible={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        onSuccess={handleDocumentUploadComplete}
        sellerProfileId={sellerProfile.id}
      />

      {/* Face Verification Modal */}
      <FaceVerificationModal
        visible={showFaceModal}
        onClose={() => {
          setShowFaceModal(false);
          setDocumentData(null); // Reset if user cancels
        }}
        onSuccess={handleFaceVerificationComplete}
        requireAllPoses={true}
        countdownSeconds={3}
        allowCameraSwitch={true}
      />
    </AppView>
  );
}
