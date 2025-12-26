import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo } from "react";
import * as Yup from "yup";

import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import { useFormik } from "formik";
import { Keyboard } from "react-native";
import { toast } from "sonner-native";
import AppText from "../ui/AppText";
import InputField from "../ui/InputField";
import PrimaryButton from "../ui/PrimaryButton";

export interface ChangeUsernameSheetProps {
  close?: () => void;
}

const UsernameSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .required("Username is required"),
});

export const ChangeUsernameSheet = forwardRef<
  BottomSheet,
  ChangeUsernameSheetProps
>((props, ref) => {
  const { spacing, colors, icons } = useTheme();
  const { updateProfileAsync, isUpdatingProfile } = useAuth();

  const snapPoints = useMemo(() => [ "75%"], []);

  const formik = useFormik({
    initialValues: { username: "" },
    validationSchema: UsernameSchema,
    onSubmit: async (values) => {
      try {
        await updateProfileAsync({ username: values.username });
        toast.success("Username updated successfully");
        // Close the sheet
        if (ref && 'current' in ref && ref.current) {
          ref.current.close();
        }
        formik.resetForm();
      } catch (error: any) {
        const message = error?.response?.data?.message || "Failed to update username";
        toast.error(message);
      }
    },
  });

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      index={-1}
      enablePanDownToClose
      onClose={() => Keyboard.dismiss()}
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
          gap: spacing.md,
        }}
      >
        {/* Title */}
        <AppText
          variant="xl"
          style={{ textAlign: "center", marginBottom: spacing.sm }}
        >
          Change Username
        </AppText>

        {/* Subtitle */}
        <AppText
          variant="md"
          style={{
            textAlign: "center",
            opacity: 0.7,
            marginBottom: spacing.lg,
          }}
        >
          Choose a new username for your account
        </AppText>

        {/* Username Input */}
        <InputField
          leftIcon={
            <Feather name="user" color={colors.primary} size={icons.md} />
          }
          value={formik.values.username}
          label="Username"
          placeholder="Enter your new username"
          onChangeText={formik.handleChange("username")}
          onBlur={formik.handleBlur("username")}
          error={
            formik.touched.username && formik.errors.username
              ? formik.errors.username
              : undefined
          }
        />

        {/* Button */}
        <PrimaryButton
          style={{ marginTop: spacing.lg }}
          title="Save"
          onPress={formik.handleSubmit}
          loading={isUpdatingProfile}
        />
      </BottomSheetView>
    </BottomSheet>
  );
});

ChangeUsernameSheet.displayName = "ChangeUsernameSheet";
