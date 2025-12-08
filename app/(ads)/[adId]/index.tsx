import { AdInfoBlock } from "@/components/ads/AdInfoBlock";
import { AdSellerProfile } from "@/components/ads/AdSellerProfile";
import DescriptionHTML from "@/components/ads/DescriptionHTML";
import { ImageCarousel } from "@/components/ads/ImageCarousel";
import MoreFromSellerCarousel from "@/components/ads/MoreFromSellerCarousel";
import ProductAttributesSection from "@/components/ads/ProductAttributesSection";
import { WriteReviewSheet } from "@/components/bottom-sheet/WriteReviewSheet";
import AppView from "@/components/ui/AppView";
import BottomActionBar from "@/components/ui/ButtomActionBar";
import { Header } from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import SellerRating from "@/components/ui/SellerRating";
import { TextButton } from "@/components/ui/TextButton";
import { useTheme } from "@/hooks/useTheme";
import { CategoryFieldType } from "@/types";
import { Ad } from "@/types/ad";
import { Entypo } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { formatDistanceToNow } from "date-fns";
import { router } from "expo-router";
import { Eye } from "iconsax-react-nativejs";
import React, { useRef } from "react";
import { Animated, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ad: Ad = {
  id: "cmgf4op350003ms07n1pajmcx",
  title: "Hyundai Elantra Limited 4dr Sedan (1.8L 4cyl 6A) 2015 Silver",
  description:
    "<p><strong>Hyundai Elantra Limited 4dr Sedan (1.8L 4cyl 6A) 2015 Silver</strong></p>",
  price: "120000",
  currency: "GHS",
  condition: "NEW",
  images: [
    "https://cdn.willfind8.com/willfind8-ads-media/cmeg6qvzz0000mpa4cqbd56wd/ads/eb246bb2-b89d-489e-a6ff-30ad2c7080c2.png",
    "https://cdn.willfind8.com/willfind8-ads-media/cmeg6qvzz0000mpa4cqbd56wd/ads/59d8a7fe-ba2c-4e31-9666-00616bdee336.png",
    "https://cdn.willfind8.com/willfind8-ads-media/cmeg6qvzz0000mpa4cqbd56wd/ads/6d8a46dd-6b33-4251-bd93-2b8de3423073.png",
  ],
  videos: [],
  status: "SOLD",
  isPromoted: false,
  promotionEnds: null,
  views: 67,
  userId: "cmeg6qvzz0000mpa4cqbd56wd",
  categoryId: "cmfa4dge20005lh06m12kyakn",
  cityId: null,
  address: "Atonsu Aprabon, Kumasi",
  latitude: null,
  longitude: null,
  contactPhone: "0246092155",
  contactEmail: "eric.m4511@gmail.com",
  isNegotiable: false,
  expiresAt: null,
  createdAt: "2025-10-06T12:49:50.848Z",
  updatedAt: "2025-11-29T21:49:35.231Z",
  user: {
    id: "cmeg6qvzz0000mpa4cqbd56wd",
    username: "admin",
    firstName: "System",
    lastName: "Administrator",
    avatar: "",
    phone: null,
    email: "admin@example.com",
    sellerProfile: {
      id: "cmihm3epz0001n107wkgodx6c",
      userId: "cmeg6qvzz0000mpa4cqbd56wd",
      businessName: "Teinc solutions",
      businessType: "INDIVIDUAL",
      description: "My Free lancer",
      website: null,
      socialMedia: null,
      rating: 0,
      totalReviews: 0,
      isVerified: false,
      createdAt: "2025-11-27T15:52:07.748Z",
      updatedAt: "2025-11-27T15:52:07.748Z",
    },
  },
  category: {
    id: "cmfa4dge20005lh06m12kyakn",
    name: "Cars",
    slug: "cars",
    description: null,
    icon: null,
    parentId: "cmf9y1oae0003lh06lkckplql",
    isActive: true,
    sortOrder: 0,
    createdAt: "2025-09-07T20:02:33.145Z",
    updatedAt: "2025-09-07T20:02:33.145Z",
  },
  city: null,
  fieldValues: [
    {
      id: "cmiktqt1c000jn107wur7lpb9",
      adId: "cmgf4op350003ms07n1pajmcx",
      categoryFieldId: "cmgf3wlg50001ms07yi05qb35",
      value: '["air_condition","spare_tire"]',
      createdAt: "2025-11-29T21:49:35.231Z",
      categoryField: {
        id: "cmgf3wlg50001ms07yi05qb35",
        categoryId: "cmfa4dge20005lh06m12kyakn",
        name: "available_feature",
        label: "Available Feature",
        type: "CHECKBOX",
        isRequired: false,
        options: [
          {
            label: "Air Condition",
            value: "air_condition",
          },
          {
            label: "Spare Tire",
            value: "spare_tire",
          },
        ],
        validation: {
          pattern: "",
        },
        sortOrder: 5,
        createdAt: "2025-10-06T12:27:59.765Z",
        updatedAt: "2025-10-26T17:02:18.276Z",
      },
    },
    {
      id: "cmiktqt1c000kn107c24rbqsv",
      adId: "cmgf4op350003ms07n1pajmcx",
      categoryFieldId: "cmh83d5da0007o8070i5bnpt7",
      value: "hyundai",
      createdAt: "2025-11-29T21:49:35.231Z",
      categoryField: {
        id: "cmh83d5da0007o8070i5bnpt7",
        categoryId: "cmfa4dge20005lh06m12kyakn",
        name: "brand",
        label: "Brand",
        type: "SELECT",
        isRequired: true,
        options: [
          {
            label: "Toyota",
            value: "toyota",
          },
          {
            label: "Mercedes-Benz",
            value: "mercedes-benz",
          },
          {
            label: "Ford",
            value: "ford",
          },
          {
            label: "Honda",
            value: "honda",
          },
          {
            label: "Hyundai",
            value: "hyundai",
          },
        ],
        validation: {},
        sortOrder: 0,
        createdAt: "2025-10-26T19:18:11.566Z",
        updatedAt: "2025-10-26T19:20:11.773Z",
      },
    },
  ],
  tagLinks: [],
  comments: [],
  _count: {
    savedBy: 1,
    comments: 0,
  },
  isSaved: false,
};

const ads: Ad[] = [
  {
    id: "1",
    title: "Smartphone",
    price: 299.99,
    images: [
      "https://images-na.ssl-images-amazon.com/images/I/61zIwprkyhL._SX355_.jpg",
    ],
    description: "A great smartphone with awesome features.",
    currency: "GHS",
    views: 150,
    isNegotiable: true,
    userId: "user1",
    categoryId: "1",
    createdAt: "2025-11-29T21:49:35.231Z",
  },
  {
    id: "2",
    title: "Running Shoes",
    price: 79.99,
    images: ["https://images-na.ssl-images-amazon.com/images/I/61zIwprkyhL._SX355_.jpg"],
    description: "Comfortable and durable running shoes.",
    currency: "GHS",
    views: 85,
    isNegotiable: false,
    userId: "user2",
    categoryId: "6",
    createdAt: "2025-11-29T21:49:35.231Z",
  },
  {
    id: "3",
    title: "Coffee Maker",
    price: 49.99,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    description: "Brew the perfect cup of coffee every morning.",
    currency: "GHS",
    views: 60,
    isNegotiable: true,
    userId: "user3",
    categoryId: "3",
    createdAt: "2025-11-29T21:49:35.231Z",
  },

  {
    id: "4",
    title: "Wireless Headphones",
    price: 99.99,
    images: [
      "https://images.unsplash.com/photo-1704307068094-c2c88c467014?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    description: "Experience high-quality sound without the wires.",
    currency: "GHS",
    views: 120,
    isNegotiable: false,
    userId: "user4",
    categoryId: "1",
    createdAt: "2025-11-29T21:49:35.231Z",
  },
  {
    id: "5",
    title: "Mountain Bike",
    price: 499.99,
    images: [
      "https://images.unsplash.com/photo-1699528136769-d795893462c6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    description: "Conquer any terrain with this rugged mountain bike.",
    currency: "GHS",
    views: 45,
    isNegotiable: true,
    userId: "user5",
    categoryId: "6",
    createdAt: "2025-11-29T21:49:35.231Z",
  },
];

const categoryFields = [
  {
    id: "cmhcz3j8f000gnw07z4v6qf4u",
    categoryId: "cmfohb5fo000dnw07delycyha",
    name: "brand",
    label: "Brand",
    type: CategoryFieldType.TEXT,
    isRequired: false,
    options: null,
    validation: null,
    sortOrder: 1,
    createdAt: "2025-10-28T21:07:32.997Z",
    updatedAt: "2025-10-28T21:07:32.997Z",
  },
  {
    id: "cmhcz3j8f000hnw07v6r6z1y3",
    categoryId: "cmfohb5fo000dnw07delycyha",
    name: "model",
    label: "Model",
    type: CategoryFieldType.TEXT,
    isRequired: false,
    options: null,
    validation: null,
    sortOrder: 2,
    createdAt: "2025-10-28T21:07:33.000Z",
    updatedAt: "2025-10-28T21:07:33.000Z",
  },
];

export default function AdDetailsScreen() {
  const { spacing, colors, icons } = useTheme();
  const inserts = useSafeAreaInsets();

  const reviewSheetRef = useRef<BottomSheet>(null);
  const sellerProfile = { rating: 4.5, totalReviews: 128 };

  // Animation values for header
  const lastScrollY = useRef(0);
  const headerOpacity = useRef(new Animated.Value(1)).current;

  // Handle scroll events for header animation
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const diff = currentScrollY - lastScrollY.current;

    // Detect scroll direction with minimal threshold
    if (Math.abs(diff) > 1) {
      if (diff > 0 && currentScrollY > 50) {
        // Scrolling down - hide header
        Animated.timing(headerOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else if (diff < 0) {
        // Scrolling up - show header
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
      lastScrollY.current = currentScrollY;
    }
  };

  const renderMainSection = () => {
    return (
      <>
        <AppView
          style={{
            gap: spacing.lg,
            paddingBottom: spacing.lg,
            backgroundColor: colors.background,
            marginBottom: spacing.md,
          }}
        >
          <ImageCarousel
            renderFooter={
              <AppView
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  padding: spacing.md,
                }}
              >
                <TextButton
                  title={formatDistanceToNow(new Date(ad.createdAt))}
                />
              </AppView>
            }
            images={ad.images}
            showPagination={false}
          />
          <AdInfoBlock ad={ad} />
          <SellerRating
            style={{ marginHorizontal: spacing.md }}
            rating={sellerProfile.rating}
            totalReviews={sellerProfile.totalReviews}
            onReviewPress={() => reviewSheetRef.current?.expand()}
          />
          <ProductAttributesSection ad={ad} categoryFields={categoryFields} />
          <DescriptionHTML html={ad.description || ""} />
        </AppView>
        {/* Seller Profile Section */}
        <AppView
          style={{
            backgroundColor: colors.background,
          }}
        >
          <AdSellerProfile ad={ad} />
          <MoreFromSellerCarousel ads={ads} />
        </AppView>
      </>
    );
  };

  return (
    <AppView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: inserts.top,
      }}
    >
      {/* Fixed Header */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          opacity: headerOpacity,
        }}
      >
        <Header
          left={
            <IconButton
              onPress={() => router.back()}
              icon={
                <Entypo
                  color={colors.iconBlack}
                  name="chevron-with-circle-left"
                  size={icons.md}
                />
              }
            />
          }
          right={
            <TextButton
              backgroundColor={colors.backgroundGray}
              isLeft
              icon={<Eye size={icons.sm} color={colors.iconBlack} />}
              titleStyle={{ color: colors.text }}
              title={String(ad.views)}
            />
          }
          containerStyle={{
            backgroundColor: "transparent",
            paddingHorizontal: spacing.md,
          }}
        />
      </Animated.View>

      <ScrollView
        style={{ backgroundColor: colors.backgroundGray }}
        contentContainerStyle={{ paddingBottom: spacing.md, gap: spacing.sm }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {renderMainSection()}
      </ScrollView>
      <BottomActionBar
        style={{ paddingBottom: inserts.bottom }}
        onMessage={function (): void {
          throw new Error("Function not implemented.");
        }}
        onCall={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <WriteReviewSheet
        ref={reviewSheetRef}
        sellerId="seller-id-123"
        onSubmit={(review) => {
          // Handle review submission
          console.log(review);
          reviewSheetRef.current?.close();
        }}
      />
    </AppView>
  );
}
