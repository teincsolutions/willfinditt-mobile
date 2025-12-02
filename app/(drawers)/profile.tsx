import DrawerHeaderToggle from "@/components/drawer/DrawerHeaderToggle";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { Avatar } from "@/components/ui/Avatar";
import DatePicker from "@/components/ui/DatePicker";
import { Header } from "@/components/ui/Header";
import InputField from "@/components/ui/InputField";
import PlaceholderField from "@/components/ui/PlaceholderField";
import { TextButton } from "@/components/ui/TextButton";
import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import Drawer from "expo-router/drawer";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import * as Yup from "yup";

// -------------------------
// VALIDATION SCHEMA
// -------------------------
const BasicInfoSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  dateOfBirth: Yup.date().nullable().notRequired(),
});

export default function ProfileScreen() {
  const { icons, spacing, colors, radius, fontSizes } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const user = {
    firstName: "Silvia",
    lastName: "Aful",
    dateOfBirth: null,
  };

  const { values, handleChange, setFieldValue, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
      },
      validationSchema: BasicInfoSchema,
      onSubmit: (values) => {
        // Handle profile update logic here
        console.log("Profile updated:", values);
      },
    });

  const lastNameRef = useRef<TextInput>(null);

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.background }}>
      <Drawer.Screen
        options={{
          header: () => (
            <Header
              left={<DrawerHeaderToggle />}
              right={
                <TextButton
                  onPress={() => {
                    setIsEditing(!isEditing);
                  }}
                  title={isEditing ? "Save" : "Edit"}
                  titleStyle={{
                    color: colors.textWhite,
                    fontSize: fontSizes.md,
                  }}
                  style={{ borderRadius: radius.md }}
                  backgroundColor={colors.primary}
                />
              }
              rightSideStyle={{ marginRight: spacing.md }}
            />
          ),
        }}
      />
      <AppView
        style={{ height: 120, backgroundColor: colors.backgroundPrimary }}
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
                borderSize={4}
                size="xxl"
                styleContainer={{ marginBottom: spacing.md }}
                verified
              />
              <AppText variant="lg" style={{ marginTop: spacing.md }}>
                Silvia Aful
              </AppText>

              <AppText
                variant="sm"
                style={{ marginTop: spacing.sm, opacity: 0.7 }}
              >
                Joined Nov 12, 2025
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
                <DatePicker
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
                  value={"Silvia"}
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
                  value={"Aful"}
                />

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
                    values.dateOfBirth ? values.dateOfBirth.toDateString() : ""
                  }
                />
              </AppView>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </AppView>
    </AppView>
  );
}
