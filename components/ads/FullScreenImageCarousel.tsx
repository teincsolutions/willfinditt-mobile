import { useTheme } from "@/contexts/ThemeContext";
import { Image } from "expo-image";
import { CloseCircle } from "iconsax-react-nativejs";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StatusBar,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DotPagination } from "../sliders/DotPagination";
import AppView from "../ui/AppView";

const { width, height } = Dimensions.get("window");

interface FullScreenImageCarouselProps {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export function FullScreenImageCarousel({
  visible,
  images,
  initialIndex = 0,
  onClose,
}: FullScreenImageCarouselProps) {
  const inserts = useSafeAreaInsets();
  const { colors, icons, spacing } = useTheme();
  const [index, setIndex] = useState(initialIndex);
  const ref = useRef<FlatList>(null);

  // Scroll to initial index when modal opens
  React.useEffect(() => {
    if (visible && ref.current && initialIndex > 0) {
      setTimeout(() => {
        ref.current?.scrollToIndex({ index: initialIndex, animated: false });
      }, 100);
    }
  }, [visible, initialIndex]);

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <AppView
        style={{
          flex: 1,
          backgroundColor: colors.black,
          paddingTop: StatusBar.currentHeight || 0,
        }}
      >
        {/* Fullscreen Image Carousel */}
        <AppView style={{ flex: 1, justifyContent: "center" }}>
          <FlatList
            ref={ref}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            onScroll={(e) =>
              setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
            }
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            renderItem={({ item }) => (
              <AppView
                style={{
                  width,
                  height,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{ width: width, height: height * 0.7 }}
                  contentFit="contain"
                />
              </AppView>
            )}
          />

          {/* Pagination */}
          <AppView
            style={{
              position: "absolute",
              bottom: 40,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <DotPagination index={index} total={images.length} />
          </AppView>
        </AppView>
      </AppView>
      {/* Close Button */}
      <View
        style={{
          position: "absolute",
          top: spacing.md + inserts.top,
          right: spacing.md,
        }}
      >
        <Pressable style={{ padding: spacing.xs }} onPress={onClose}>
          <CloseCircle
            size={icons.xl}
            color={colors.iconWhite}
            variant="Bold"
          />
        </Pressable>
      </View>
    </Modal>
  );
}
