import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity } from "react-native";
import { DotPagination } from "../sliders/DotPagination";
import AppView from "../ui/AppView";
import { FullScreenImageCarousel } from "./FullScreenImageCarousel";

const { width } = Dimensions.get("window");

export function ImageCarousel({
  images,
  showPagination = true,
  renderHeader,
}: {
  images: string[];
  showPagination?: boolean;
  renderHeader?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [fullScreenVisible, setFullScreenVisible] = useState(false);
  const [fullScreenIndex, setFullScreenIndex] = useState(0);
  const ref = useRef<FlatList>(null);

  const handleImagePress = (itemIndex: number) => {
    setFullScreenIndex(itemIndex);
    setFullScreenVisible(true);
  };

  return (
    <AppView style={{ flex: 1 }}>
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
        renderItem={({ item, index: itemIndex }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleImagePress(itemIndex)}
          >
            <Image
              source={{ uri: item }}
              style={{ width, height: width * 0.9 }}
              contentFit="cover"
            />
          </TouchableOpacity>
        )}
      />
      {showPagination && <DotPagination index={index} total={images.length} />}
      {renderHeader && (
        <AppView style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
          {renderHeader}
        </AppView>
      )}

      {/* Fullscreen Image Carousel Modal */}
      <FullScreenImageCarousel
        visible={fullScreenVisible}
        images={images}
        initialIndex={fullScreenIndex}
        onClose={() => setFullScreenVisible(false)}
      />
    </AppView>
  );
}
