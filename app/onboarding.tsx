import AppText from "@/components/ui/AppText";
import IconButton from "@/components/ui/IconButton";
import { TextButton } from "@/components/ui/TextButton";
import { useTheme } from "@/hooks/useTheme";
import { mmkvStorage } from "@/utils/mmkvStorage";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    title: "Find anything",
    description:
      "Browse thousands of products from verified sellers across Ghana. Find everything you need in one place.",
    image: require("@/assets/images/shop-anything.png"),
  },
  {
    id: 2,
    title: "Find Jobs & Events",
    description:
      "Discover job opportunities and local events happening around you. Stay connected and never miss out.",
    image: require("@/assets/images/job-and-events.png"),
  },
  {
    id: 3,
    title: "Find Accommodation",
    description:
      "Easily find accommodation that suits your needs. Explore listings with photos, prices, and reviews to make informed decisions.",
    image: require("@/assets/images/accommodation.png"),
  },
];

export default function OnboardingScreen() {
  const { colors, spacing, icons, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      // Mark onboarding as complete
      mmkvStorage.setFirstLaunchComplete();
      router.replace("/(auth)/login");
    }
  };

  const hanlePrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    // Mark onboarding as complete
    mmkvStorage.setFirstLaunchComplete();
    router.replace("/(auth)/login");
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
        <Image
          style={{ width: SCREEN_WIDTH, height: "100%" }}
          source={item.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.9)"]}
          style={styles.overlay}
        />
        <View
          style={[
            styles.contentContainer,
            {
              gap: spacing.sm,
              bottom: insets.bottom + 120,
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          <AppText
            variant="xxl"
            style={{ fontWeight: "bold", color: colors.textWhite }}
          >
            {item.title}
          </AppText>
          <AppText variant="lg" style={{ color: colors.textWhite }}>
            {item.description}
          </AppText>
        </View>
      </View>
    );
  };

  const PaginationDot = ({ index }: { index: number }) => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const dotStyle = useAnimatedStyle(() => {
      const width = interpolate(
        scrollX.value,
        inputRange,
        [8, 24, 8],
        Extrapolation.CLAMP
      );

      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.3, 1, 0.3],
        Extrapolation.CLAMP
      );

      return {
        width,
        opacity,
      };
    });

    return (
      <Animated.View
        style={[styles.dot, { backgroundColor: colors.iconWhite }, dotStyle]}
      />
    );
  };

  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => (
          <PaginationDot key={index} index={index} />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            flexDirection: "row",
            justifyContent: "flex-end",
            top: insets.top + spacing.xxl,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        {currentIndex < onboardingData.length - 1 && (
          <TextButton
            title="Skip"
            style={{
              paddingEnd: spacing.xs,
              height: 40,
              borderRadius: radius.xl,
            }}
            onPress={handleSkip}
            icon={
              <Feather
                name="arrow-right-circle"
                size={icons.md}
                color={colors.iconBlack}
              />
            }
          />
        )}
      </View>
      {/* Carousel */}
      <Animated.FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / SCREEN_WIDTH
          );
          setCurrentIndex(index);
        }}
      />
      {/* Pagination */}
      <View
        style={[
          styles.footer,
          { bottom: insets.bottom + 50, paddingHorizontal: spacing.md },
        ]}
      >
        <Pagination />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          {currentIndex > 0 && (
            <Feather
              onPress={hanlePrevious}
              name="arrow-left-circle"
              size={icons.md}
              color={colors.iconWhite}
            />
          )}
          {currentIndex === onboardingData.length - 1 ? (
            <TextButton title={"Get Started"} onPress={handleNext} />
          ) : (
            <IconButton
              icon={
                <Feather
                  name="arrow-right-circle"
                  size={icons.md}
                  color={colors.iconBlack}
                />
              }
              onPress={handleNext}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    position: "absolute",
    alignItems: "flex-start",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  footer: {
    flexDirection: "row",
    position: "absolute",
    justifyContent: "space-between",
    alignItems: "center",
    left: 0,
    right: 0,
    zIndex: 10,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
