// components/home/PromoSlider.tsx
import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ImageBackground, ScrollView, View } from "react-native";
import { DotPagination } from "./DotPagination";

const { width } = Dimensions.get("window");

export function PromoSlider({ data }: { data: any[] }) {
  const { spacing, radius, colors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (index + 1) % data.length;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setIndex(next);
    }, 3500);

    return () => clearInterval(timer);
  }, [index, data.length]);

  return (
    <View style={{ marginTop: spacing.lg }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
        scrollEventThrottle={16}
      >
        {data.map((item, i) => (
          <ImageBackground
            key={i}
            source={{ uri: item.image }}
            style={{
              width,
              height: 180,
              justifyContent: "center",
              paddingHorizontal: spacing.lg,
            }}
            imageStyle={{ borderRadius: radius.lg }}
          >
            <AppText
              variant="lg"
              style={{ color: colors.textWhite, width: "70%" }}
            >
              {item.title}
            </AppText>
            <AppText
              variant="sm"
              style={{ color: colors.textWhite, width: "70%", marginTop: 6 }}
            >
              {item.subtitle}
            </AppText>
          </ImageBackground>
        ))}
      </ScrollView>

      <DotPagination index={index} total={data.length} />
    </View>
  );
}
