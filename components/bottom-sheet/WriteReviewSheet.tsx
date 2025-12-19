import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo, useState } from "react";
import * as Yup from "yup";

import { useTheme } from "@/contexts/ThemeContext";
import { CreateSellerReview } from "@/types/user";
import { Feather } from "@expo/vector-icons";
import { useFormik } from "formik";
import { Keyboard, KeyboardAvoidingView, Pressable, View } from "react-native";
import AppText from "../ui/AppText";
import PrimaryButton from "../ui/PrimaryButton";
import TextAreaField from "../ui/TextAreaField";

export interface WriteReviewSheetProps {
  sellerId: string;
  onSubmit?: (review: CreateSellerReview) => void;
  close?: () => void;
}

const ReviewSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5")
    .required("Rating is required"),
  comment: Yup.string()
    .min(10, "Comment must be at least 10 characters")
    .max(500, "Comment must be at most 500 characters")
    .optional(),
});

export const WriteReviewSheet = forwardRef<BottomSheet, WriteReviewSheetProps>(
  (props, ref) => {
    const { spacing, colors, icons } = useTheme();
    const [selectedRating, setSelectedRating] = useState(0);

    const snapPoints = useMemo(() => ["75%"], []);

    const formik = useFormik({
      initialValues: { rating: 0, comment: "" },
      validationSchema: ReviewSchema,
      onSubmit: (values) => {
        const review: CreateSellerReview = {
          sellerId: props.sellerId,
          rating: values.rating,
          comment: values.comment || undefined,
        };
        if (props.onSubmit) {
          props.onSubmit(review);
        }
        console.log("Review submitted:", review);
      },
    });

    const handleRatingPress = (rating: number) => {
      setSelectedRating(rating);
      formik.setFieldValue("rating", rating);
    };

    const renderStars = () => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <Pressable
            key={i}
            onPress={() => handleRatingPress(i)}
            style={{ padding: spacing.xs }}
          >
            <Feather
              name="star"
              size={icons.xl}
              color={
                i <= selectedRating ? colors.secondary : colors.iconLightGray
              }
              fill={i <= selectedRating ? colors.secondary : "transparent"}
            />
          </Pressable>
        );
      }
      return stars;
    };

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
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={120}>
          <BottomSheetScrollView
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            }}
            contentContainerStyle={{
              gap: spacing.md,
              paddingBottom: spacing.xl,
            }}
          >
            {/* Title */}
            <AppText
              variant="xl"
              fontWeight="bold"
              style={{ textAlign: "center", marginBottom: spacing.sm }}
            >
              Write a Review
            </AppText>

            {/* Subtitle */}
            <AppText
              variant="md"
              style={{
                textAlign: "center",
                opacity: 0.7,
                marginBottom: spacing.md,
              }}
            >
              Share your experience with this seller
            </AppText>

            {/* Star Rating */}
            <View style={{ alignItems: "center", gap: spacing.sm }}>
              <AppText variant="md" fontWeight="medium">
                Your Rating
              </AppText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.xs,
                }}
              >
                {renderStars()}
              </View>
              {formik.touched.rating && formik.errors.rating && (
                <AppText
                  variant="sm"
                  style={{ color: colors.error, textAlign: "center" }}
                >
                  {formik.errors.rating}
                </AppText>
              )}
            </View>

            {/* Comment Input */}
            <TextAreaField
              leftIcon={
                <Feather
                  name="message-circle"
                  color={colors.iconGray}
                  size={icons.md}
                />
              }
              value={formik.values.comment}
              label="Comment (Optional)"
              placeholder="Tell us about your experience..."
              onChangeText={formik.handleChange("comment")}
              onBlur={formik.handleBlur("comment")}
              error={
                formik.touched.comment && formik.errors.comment
                  ? formik.errors.comment
                  : undefined
              }
            />

            {/* Submit Button */}
            <PrimaryButton
              style={{ marginTop: spacing.lg }}
              title="Submit Review"
              onPress={formik.handleSubmit}
              loading={formik.isSubmitting}
            />
          </BottomSheetScrollView>
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  }
);

WriteReviewSheet.displayName = "WriteReviewSheet";
