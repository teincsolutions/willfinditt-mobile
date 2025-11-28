import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ImageBackground, ScrollView, View } from "react-native";
import { DotPagination } from "./DotPagination";

const { width: DEVICE_WIDTH } = Dimensions.get("window");

export function PromoSlider({ data }: { data: any[] }) {
  const { spacing, radius, colors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  const width = DEVICE_WIDTH - spacing.md * 2;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (index + 1) % data.length;
      scrollRef.current?.scrollTo({ x: next * DEVICE_WIDTH, animated: true });
      setIndex(next);
    }, 3500);

    return () => clearInterval(timer);
  }, [index, data.length]);

  return (
    <View style={{ marginTop: spacing.lg, marginBottom:-100, zIndex:100 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / DEVICE_WIDTH
          );
          setIndex(newIndex);
        }}
        scrollEventThrottle={16}
        contentContainerStyle={{
          gap: spacing.md,
          paddingHorizontal: spacing.md,
        }}
      >
        {data.map((item, i) => (
          <ImageBackground
            key={i}
            source={item.source || { uri: item.image }}
            style={{
              width,
              height: 180,
              marginHorizontal: "auto",
              justifyContent: "center",
              paddingHorizontal: spacing.lg,
              alignItems: item.positionRight ? "flex-end" : "flex-start",
            }}
            imageStyle={{ borderRadius: radius.lg }}
          >
            <AppText
              variant="lg"
              style={{
                color: item?.color || colors.textWhite,
                fontWeight: "bold",
                width: "60%",
              }}
            >
              {item.title}
            </AppText>
            <AppText
              variant="sm"
              style={{
                color: item?.color || colors.textWhite,
                width: "60%",
                marginTop: 6,
              }}
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
