import { ProductCardSmallLandscape } from "@/components/ads/ProductCardSmallLandscape";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatHeader from "@/components/chat/ChatHeader";
import AppView from "@/components/ui/AppView";
import { useTheme } from "@/hooks/useTheme";
import Drawer from "expo-router/drawer";
import { useState } from "react";
import { FlatList } from "react-native";
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

export default function CategoriesScreen() {
  const { icons, spacing, colors } = useTheme();
  const [query, setQuery] = useState("");
  return (
    <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <Drawer.Screen
        options={{
          header: () => <ChatHeader name="Darlene" />,
        }}
      />
      <FlatList
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: spacing.lg }}
        ListHeaderComponent={<ProductCardSmallLandscape ad={ad} />}
        stickyHeaderIndices={[0]}
        data={[
          { id: "1", text: "Hello!", time: "10:00 AM", isSender: false },
          { id: "2", text: "Hi there!", time: "10:01 AM", isSender: true },
          { id: "3", text: "How are you?", time: "10:02 AM", isSender: false },
          {
            id: "4",
            text: "I'm good, thanks! And you?",
            time: "10:03 AM",
            isSender: true,
          },
          {
            id: "5",
            text: "I'm doing well.",
            time: "10:04 AM",
            isSender: false,
          },
          { id: "6", text: "Great to hear!", time: "10:05 AM", isSender: true },
          {
            id: "7",
            text: "What are you up to?",
            time: "10:06 AM",
            isSender: false,
          },
          {
            id: "8",
            text: "Just working on a project.",
            time: "10:07 AM",
            isSender: true,
          },
          {
            id: "9",
            text: "Sounds interesting.",
            time: "10:08 AM",
            isSender: false,
          },
          {
            id: "10",
            text: "Yeah, it's quite fun!",
            time: "10:09 AM",
            isSender: true,
          },
        ]}
        renderItem={({ item }) => (
          <ChatBubble
            text={item.text}
            time={item.time}
            isSender={item.isSender}
          />
        )}
      />
    </AppView>
  );
}
