import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { Avatar } from "@/components/ui/Avatar";
import DatePicker from "@/components/ui/DatePicker";
import { Header } from "@/components/ui/Header";
import InputField from "@/components/ui/InputField";
import PlaceholderField from "@/components/ui/PlaceholderField";
import SearchableSelectModal from "@/components/ui/SearchableSelectModal";
import { TextButton } from "@/components/ui/TextButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useCountries } from "@/hooks/useLocations";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import * as Yup from "yup";

// -------------------------
// VALIDATION SCHEMA
// -------------------------
const BasicInfoSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  dateOfBirth: Yup.date().nullable().notRequired(),
  countryId: Yup.string().required("Country is required"),
});

export default function ProfileScreen() {
  const { icons, spacing, colors, radius, fontSizes } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, isLoading, updateProfileAsync, isUpdatingProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data: countries = [] } = useCountries();
  const countryOptions = countries.map((c) => ({ label: c.name, value: c.id }));

  const {
    values,
    handleChange,
    setFieldValue,
    handleBlur,
    errors,
    touched,
    handleSubmit,
  } = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : null,
      countryId: user?.countryId || "",
    },
    validationSchema: BasicInfoSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateProfileAsync({
          firstName: values.firstName,
          lastName: values.lastName,
          //  dateOfBirth: values.dateOfBirth?.toISOString(),
          countryId: values.countryId,
        });
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } catch (error: any) {
        toast.error(
          error.response.data.message ||
            error?.message ||
            "Failed to update profile"
        );
      }
    },
  });

  const lastNameRef = useRef<TextInput>(null);

  if (isLoading || !user) {
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

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: "",
          header: () => (
            <Header
              containerStyle={{ paddingHorizontal: spacing.md }}
              right={
                <TextButton
                  onPress={() => {
                    if (isEditing) {
                      handleSubmit();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  title={
                    isUpdatingProfile
                      ? "Saving..."
                      : isEditing
                      ? "Save"
                      : "Edit"
                  }
                  titleStyle={{
                    color: colors.textWhite,
                    fontSize: fontSizes.md,
                  }}
                  style={{ borderRadius: radius.md, height: icons.lg }}
                  backgroundColor={colors.primary}
                />
              }
            />
          ),
        }}
      />
      <AppView
        style={{ height: 80, backgroundColor: colors.backgroundPrimary }}
      />
      <AppView
        style={{
          flex: 1,
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          position: "absolute",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={100}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: spacing.md,
              paddingBottom: insets.bottom + spacing.md,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
          >
            <AppView
              style={{
                alignItems: "center",
                paddingVertical: spacing.lg,
                zIndex: 100,
              }}
            >
              <Avatar
                borderSize={2}
                size="xl"
                styleContainer={{ marginBottom: spacing.md }}
                verified={user.isVerified}
                uri={user.avatar}
                name={fullName}
              />
              <AppText variant="lg" style={{ marginTop: spacing.md }}>
                {fullName}
              </AppText>

              <AppText
                variant="sm"
                style={{ marginTop: spacing.sm, opacity: 0.7 }}
              >
                Joined {joinedDate}
              </AppText>
            </AppView>

            {isEditing ? (
              <AppView style={{ gap: spacing.md, marginBottom: spacing.xxl }}>
                <InputField
                  inputStyle={{ backgroundColor: colors.iconLightGray }}
                  leftIcon={
                    <Feather
                      name="user"
                      color={colors.iconGray}
                      size={icons.md}
                    />
                  }
                  label="Firstname"
                  placeholder="Enter your first name"
                  value={values.firstName}
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  error={touched.firstName && errors.firstName}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmit={() => lastNameRef.current?.focus()}
                />

                <InputField
                  ref={lastNameRef}
                  inputStyle={{ backgroundColor: colors.iconLightGray }}
                  leftIcon={
                    <Feather
                      name="user"
                      color={colors.iconGray}
                      size={icons.md}
                    />
                  }
                  label="Lastname"
                  placeholder="Enter your last name"
                  value={values.lastName}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  error={touched.lastName && errors.lastName}
                />

                {false && (
                  <DatePicker
                    visible={showDatePicker}
                    inputStyle={{ backgroundColor: colors.iconLightGray }}
                    leftIcon={
                      <Feather
                        name="calendar"
                        color={colors.iconGray}
                        size={icons.md}
                      />
                    }
                    label="Date of Birth"
                    value={values.dateOfBirth || new Date("1900-01-01")}
                    placeholder="Select your date of birth"
                    error={touched.dateOfBirth && errors.dateOfBirth}
                    onChange={(date) => setFieldValue("dateOfBirth", date)}
                    onClose={() => setShowDatePicker(false)}
                    onOpen={() => setShowDatePicker(true)}
                    rightIcon={
                      <Feather
                        name="chevron-down"
                        color={colors.iconGray}
                        size={icons.md}
                      />
                    }
                  />
                )}

                <PlaceholderField
                  inputStyle={{ backgroundColor: colors.iconLightGray }}
                  leftIcon={
                    <Feather
                      name="map-pin"
                      color={colors.iconGray}
                      size={icons.md}
                    />
                  }
                  rightIcon={
                    <Feather
                      name="chevron-down"
                      color={colors.iconGray}
                      size={icons.md}
                    />
                  }
                  label="Country"
                  placeholder="Select your country"
                  value={
                    countryOptions.find((c) => c.value === values.countryId)
                      ?.label || ""
                  }
                  onPress={() => setShowCountryModal(true)}
                />
              </AppView>
            ) : (
              <AppView style={{ gap: spacing.md, marginBottom: spacing.xxl }}>
                <PlaceholderField
                  leftIcon={
                    <Feather
                      name="user"
                      color={colors.iconGray}
                      size={icons.md}
                    />
                  }
                  label="Firstname"
                  placeholder="Not set"
                  value={user.firstName || ""}
                />

                <PlaceholderField
                  leftIcon={
                    <Feather
                      name="user"
                      color={colors.iconGray}
                      size={icons.md}
                    />
                  }
                  label="Lastname"
                  placeholder="Not set"
                  value={user.lastName || ""}
                />

                {false && (
                  <PlaceholderField
                    leftIcon={
                      <Feather
                        name="calendar"
                        color={colors.iconGray}
                        size={icons.md}
                      />
                    }
                    label="Date of Birth"
                    placeholder="Not set"
                    value={
                      values.dateOfBirth
                        ? values.dateOfBirth?.toDateString()
                        : ""
                    }
                  />
                )}

                <PlaceholderField
                  leftIcon={
                    <Feather
                      name="map-pin"
                      color={colors.iconGray}
                      size={icons.md}
                    />
                  }
                  label="Country"
                  placeholder="Not set"
                  value={
                    countryOptions.find((c) => c.value === values?.countryId)
                      ?.label || ""
                  }
                />
              </AppView>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </AppView>

      <SearchableSelectModal
        visible={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        options={countryOptions}
        value={values.countryId}
        onSelect={(value) => {
          setFieldValue("countryId", value);
          setShowCountryModal(false);
        }}
        placeholder="Select Country"
        searchPlaceholder="Search countries..."
      />
    </AppView>
  );
}
