import DotPagination from "@/components/ui/DotPagination";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import { Dimensions, FlatList } from "react-native";
import AppView from "../ui/AppView";

const { width } = Dimensions.get("window");

export function ImageCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList>(null);
  
  return (
    <AppView>
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
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width, height: width * 0.9 }}
            contentFit="cover"
          />
        )}
      />
      <DotPagination index={index} total={images.length} />
    </AppView>
  );
}
