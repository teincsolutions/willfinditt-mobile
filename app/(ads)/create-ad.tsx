import ImageUploader from "@/components/ads/AdImageUploader";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import InputField from "@/components/ui/InputField";
import PlaceholderField from "@/components/ui/PlaceholderField";
import RangeInput from "@/components/ui/RangeInput";
import RichTextArea from "@/components/ui/RichTextArea";
import SecondaryTextButton from "@/components/ui/SecondaryTextButton";
import { TextButton } from "@/components/ui/TextButton";
import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { RichEditor } from "react-native-pell-rich-editor";

export default function AdDetailsScreen() {
  const { spacing, colors, radius, icons } = useTheme();
  const [range, setRange] = useState({ low: 0, high: 100000 });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const richEditorRef = useRef<RichEditor>(null);
  const [images, setImages] = useState<string[]>([]);

  return (
    <AppView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <Header
        left={
          <SecondaryTextButton
            variant="lg"
            title="Cancel"
            onPress={() => {
              router.back();
            }}
          />
        }
        right={
          <TextButton
            style={{ backgroundColor: colors.primary, borderRadius: radius.md }}
            title={"Save"}
            titleStyle={{ color: colors.textWhite }}
            loading
            accentColor={colors.iconWhite}
            onPress={() => {}}
          />
        }
        navRowStyle={{ marginHorizontal: spacing.md }}
        containerStyle={{
          backgroundColor: "transparent",
        }}
      />

      <ScrollView contentContainerStyle={{}}>
        <Pressable
          onPress={() => {
            richEditorRef.current?.dismissKeyboard();
          }}
        >
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
            <AppView
              style={{
                paddingHorizontal: spacing.md,
                gap: spacing.md,
              }}
            >
              <ImageUploader
                label="Images"
                initialImages={images}
                onImagesUploaded={(imgs: string[]) => setImages(imgs)}
              />
              <PlaceholderField
                onPress={() => router.push("/categories")}
                placeholder={"Select a category"}
                label={"Category"}
                inputStyle={[
                  {
                    backgroundColor: colors.selectBg,
                    paddingRight: spacing.sm,
                  },
                ]}
                value={""}
                rightIcon={
                  <IconButton
                    onPress={() => router.push("/categories")}
                    style={{
                      backgroundColor: colors.iconLightGray,
                      borderRadius: radius.sm,
                    }}
                    icon={
                      <Feather
                        name="chevron-down"
                        size={icons.sm}
                        color={colors.iconGray}
                      />
                    }
                  />
                }
              />

              <PlaceholderField
                onPress={() => router.push("/regions")}
                placeholder={"Select a location"}
                label={"Location"}
                inputStyle={[
                  {
                    backgroundColor: colors.selectBg,
                    paddingRight: spacing.sm,
                  },
                ]}
                value={""}
                rightIcon={
                  <IconButton
                    onPress={() => router.push("/regions")}
                    style={{
                      backgroundColor: colors.iconLightGray,
                      borderRadius: radius.sm,
                    }}
                    icon={
                      <Feather
                        name="chevron-down"
                        size={icons.sm}
                        color={colors.iconGray}
                      />
                    }
                  />
                }
              />
              <InputField
                value={title}
                label="Title"
                placeholder="Enter title for the ad/product"
                onChangeText={setTitle}
                onBlur={() => {}}
                error={undefined}
              />
              <RichTextArea
                ref={richEditorRef}
                label="Description"
                value={description}
                onChange={setDescription}
              />
              <RangeInput
                label="Price Range"
                minValue={range.low.toString()}
                maxValue={range.high.toString()}
                onMinChange={(value) =>
                  setRange((prev) => ({ ...prev, low: Number(value) }))
                }
                onMaxChange={(value) =>
                  setRange((prev) => ({ ...prev, high: Number(value) }))
                }
              />
            </AppView>
          </KeyboardAvoidingView>
        </Pressable>
      </ScrollView>
    </AppView>
  );
}
