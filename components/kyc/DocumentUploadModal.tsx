import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useUploadDocuments } from "@/hooks/useUpload";
import { DocumentType } from "@/types/enums";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    TextInput
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import * as Yup from "yup";
import TextAreaField from "../ui/TextAreaField";

const DocumentUploadSchema = Yup.object().shape({
  documentType: Yup.string()
    .oneOf(
      [
        DocumentType.NATIONAL_ID,
        DocumentType.DRIVERS_LICENSE,
        DocumentType.PASSPORT,
      ],
      "Please select a valid document type"
    )
    .required("Document type is required"),
  documentNumber: Yup.string().required("Document number is required"),
  fullName: Yup.string().optional(),
  documentIssueDate: Yup.string().optional(),
  documentExpiryDate: Yup.string().optional(),
  address: Yup.string().required("Address is required"),
  additionalNotes: Yup.string().optional(),
});

interface DocumentUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (data: {
    documentType: DocumentType;
    documentNumber: string;
    fullName?: string;
    documentIssueDate?: string;
    documentExpiryDate?: string;
    address: string;
    documents: string[];
    additionalNotes?: string;
  }) => void;
  sellerProfileId: string;
}

export default function DocumentUploadModal({
  visible,
  onClose,
  onSuccess,
  sellerProfileId,
}: DocumentUploadModalProps) {
  const { colors, spacing, radius, icons, fontSizes } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedDocuments, setSelectedDocuments] = useState<
    { uri: string; name: string; type: string }[]
  >([]);
  const { mutateAsync: uploadDocuments, isPending: isUploading } =
    useUploadDocuments();

  const documentNumberRef = useRef<TextInput>(null);
  const fullNameRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);

  const formik = useFormik({
    initialValues: {
      documentType: "" as DocumentType,
      documentNumber: "",
      fullName: "",
      documentIssueDate: "",
      documentExpiryDate: "",
      address: "",
      additionalNotes: "",
    },
    validationSchema: DocumentUploadSchema,
    onSubmit: async (values) => {
      if (selectedDocuments.length === 0) {
        toast.error("Please upload at least one document");
        return;
      }

      try {
        // Upload documents
        const formData = new FormData();
        selectedDocuments.forEach((doc, index) => {
          formData.append("documents", {
            uri: doc.uri,
            name: doc.name,
            type: doc.type,
          } as any);
        });

        const uploadResponse = await uploadDocuments(formData);

        // Call success callback with form data and uploaded URLs
        onSuccess({
          documentType: values.documentType,
          documentNumber: values.documentNumber,
          fullName: values.fullName || undefined,
          documentIssueDate: values.documentIssueDate || undefined,
          documentExpiryDate: values.documentExpiryDate || undefined,
          address: values.address,
          documents: uploadResponse.urls||[],
          additionalNotes: values.additionalNotes || undefined,
        });

        // Reset form
        formik.resetForm();
        setSelectedDocuments([]);
        onClose();
      } catch (error: any) {
        toast.error(error?.message || "Failed to upload documents");
      }
    },
  });

  const pickDocuments = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 3,
      });

      if (!result.canceled && result.assets) {
        const newDocs = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.fileName || `document_${Date.now()}.jpg`,
          type: asset.type === "image" ? "image/jpeg" : "image/jpeg",
        }));

        setSelectedDocuments((prev) => [...prev, ...newDocs].slice(0, 3));
      }
    } catch (error) {
      console.error("Error picking documents:", error);
      toast.error("Failed to pick documents");
    }
  };

  const removeDocument = (index: number) => {
    setSelectedDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const documentTypeOptions = [
    { label: "National ID", value: DocumentType.NATIONAL_ID },
    { label: "Driver's License", value: DocumentType.DRIVERS_LICENSE },
    { label: "Passport", value: DocumentType.PASSPORT },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <AppView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: insets.top,
        }}
      >
        {/* Header */}
        <AppView
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <AppText variant="xl" style={{ fontWeight: "600" }}>
            Upload Documents
          </AppText>
          <Pressable onPress={onClose}>
            <Feather name="x" size={icons.lg} color={colors.text} />
          </Pressable>
        </AppView>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: spacing.md,
            paddingBottom: insets.bottom + spacing.xxl,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Instructions */}
          <AppView
            style={{
              padding: spacing.md,
              backgroundColor: colors.backgroundSecondary,
              borderRadius: radius.md,
              marginBottom: spacing.lg,
            }}
          >
            <AppText variant="sm" style={{ color: colors.textGray }}>
              Please upload clear photos of your identification document. You
              can upload up to 3 images (front, back, and any additional pages).
            </AppText>
          </AppView>

          {/* Document Type Selection */}
          <AppView style={{ marginBottom: spacing.md }}>
            <AppText
              variant="md"
              style={{ fontWeight: "600", marginBottom: spacing.sm }}
            >
              Document Type *
            </AppText>
            <AppView style={{ gap: spacing.sm }}>
              {documentTypeOptions.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() =>
                    formik.setFieldValue("documentType", option.value)
                  }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: spacing.md,
                    backgroundColor:
                      formik.values.documentType === option.value
                        ? colors.primaryLight
                        : colors.backgroundSecondary,
                    borderRadius: radius.md,
                    borderWidth: 2,
                    borderColor:
                      formik.values.documentType === option.value
                        ? colors.primary
                        : "transparent",
                  }}
                >
                  <AppView
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor:
                        formik.values.documentType === option.value
                          ? colors.primary
                          : colors.border,
                      backgroundColor:
                        formik.values.documentType === option.value
                          ? colors.primary
                          : "transparent",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: spacing.sm,
                    }}
                  >
                    {formik.values.documentType === option.value && (
                      <AppView
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: colors.textWhite,
                        }}
                      />
                    )}
                  </AppView>
                  <AppText variant="md">{option.label}</AppText>
                </Pressable>
              ))}
            </AppView>
            {formik.touched.documentType && formik.errors.documentType && (
              <AppText
                variant="xs"
                style={{ color: colors.error, marginTop: spacing.xs }}
              >
                {formik.errors.documentType}
              </AppText>
            )}
          </AppView>

          {/* Document Number */}
          <InputField
            ref={documentNumberRef}
            leftIcon={
              <Feather name="file-text" color={colors.iconGray} size={icons.md} />
            }
            label="Document Number *"
            placeholder="Enter document number"
            value={formik.values.documentNumber}
            onChangeText={formik.handleChange("documentNumber")}
            onBlur={formik.handleBlur("documentNumber")}
            error={
              formik.touched.documentNumber && formik.errors.documentNumber
            }
            returnKeyType="next"
            onSubmit={() => fullNameRef.current?.focus()}
          />

          {/* Full Name */}
          <InputField
            ref={fullNameRef}
            leftIcon={
              <Feather name="user" color={colors.iconGray} size={icons.md} />
            }
            label="Full Name (Optional)"
            placeholder="Full name as on document"
            value={formik.values.fullName}
            onChangeText={formik.handleChange("fullName")}
            onBlur={formik.handleBlur("fullName")}
            returnKeyType="next"
            onSubmit={() => addressRef.current?.focus()}
          />

          {/* Address */}
          <InputField
            ref={addressRef}
            leftIcon={
              <Feather name="map-pin" color={colors.iconGray} size={icons.md} />
            }
            label="Address *"
            placeholder="Your physical address"
            value={formik.values.address}
            onChangeText={formik.handleChange("address")}
            onBlur={formik.handleBlur("address")}
            error={formik.touched.address && formik.errors.address}
            returnKeyType="next"
            onSubmit={() => notesRef.current?.focus()}
          />

          {/* Additional Notes */}
          <TextAreaField
            ref={notesRef}
            leftIcon={
              <Feather name="message-square" color={colors.iconGray} size={icons.md} />
            }
            label="Additional Notes (Optional)"
            placeholder="Any additional information"
            value={formik.values.additionalNotes}
            onChangeText={formik.handleChange("additionalNotes")}
            onBlur={formik.handleBlur("additionalNotes")}
            numberOfLines={3}
          />

          {/* Document Upload Section */}
          <AppView style={{ marginTop: spacing.md }}>
            <AppText
              variant="md"
              style={{ fontWeight: "600", marginBottom: spacing.sm }}
            >
              Upload Documents * (Max 3)
            </AppText>

            {/* Upload Button */}
            <Pressable
              onPress={pickDocuments}
              disabled={selectedDocuments.length >= 3}
              style={{
                padding: spacing.lg,
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor:
                  selectedDocuments.length >= 3
                    ? colors.border
                    : colors.primary,
                borderRadius: radius.md,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  selectedDocuments.length >= 3
                    ? colors.backgroundGray
                    : colors.backgroundSecondary,
                marginBottom: spacing.md,
              }}
            >
              <Feather
                name="upload"
                size={icons.xl}
                color={
                  selectedDocuments.length >= 3
                    ? colors.textGray
                    : colors.primary
                }
              />
              <AppText
                variant="md"
                style={{
                  marginTop: spacing.sm,
                  color:
                    selectedDocuments.length >= 3
                      ? colors.textGray
                      : colors.text,
                }}
              >
                {selectedDocuments.length >= 3
                  ? "Maximum 3 documents"
                  : "Tap to upload documents"}
              </AppText>
              <AppText variant="xs" style={{ color: colors.textGray }}>
                {selectedDocuments.length}/3 uploaded
              </AppText>
            </Pressable>

            {/* Selected Documents List */}
            {selectedDocuments.map((doc, index) => (
              <AppView
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: spacing.md,
                  backgroundColor: colors.backgroundSecondary,
                  borderRadius: radius.md,
                  marginBottom: spacing.sm,
                }}
              >
                <AppView
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Feather
                    name="file"
                    size={icons.md}
                    color={colors.primary}
                  />
                  <AppText
                    variant="sm"
                    numberOfLines={1}
                    style={{ marginLeft: spacing.sm, flex: 1 }}
                  >
                    {doc.name}
                  </AppText>
                </AppView>
                <Pressable onPress={() => removeDocument(index)}>
                  <Feather name="trash-2" size={icons.md} color={colors.error} />
                </Pressable>
              </AppView>
            ))}
          </AppView>
        </ScrollView>

        {/* Submit Button */}
        <AppView
          style={{
            padding: spacing.md,
            paddingBottom: insets.bottom + spacing.md,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <PrimaryButton
            title={
              isUploading ? "Uploading..." : "Continue to Face Verification"
            }
            onPress={() => formik.handleSubmit()}
            disabled={isUploading || selectedDocuments.length === 0}
          />
        </AppView>
      </AppView>
    </Modal>
  );
}
