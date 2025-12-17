import { useTheme } from "@/contexts/ThemeContext";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import React from "react";

import { useAuth } from "@/hooks/useAuth";
import { useChatStats } from "@/hooks/useChats";
import { router } from "expo-router";
import { Alert } from "react-native";
import DrawerMenuItem from "./DrawerMenuItem";
import DrawerPromoCard from "./DrawerPromoCard";
import DrawerUserHeader from "./DrawerUserHeader";

export default function CustomDrawerContent(
  props: DrawerContentComponentProps
) {
  const { colors, icons, spacing } = useTheme();
  const { logoutAsync, isAuthenticated, user } = useAuth();
  const { data: chatStats } = useChatStats(isAuthenticated);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logoutAsync();
          router.push("/(auth)/login");
        },
      },
    ]);
  };

  const handleLogin = () => {
    Alert.alert("Login", "Do you want to login now?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          router.push("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView
      style={{
        backgroundColor: colors.background,
        padding: spacing.md,
      }}
    >
      {/* USER HEADER */}
      <DrawerUserHeader />
      {/* MENU ITEMS */}
      <DrawerMenuItem
        label="Home"
        active={props.state.index === 0}
        onPress={() => {
          props.navigation.navigate("index");
        }}
        icon={({ active }) => (
          <MaterialCommunityIcons
            name={active ? "home" : "home-outline"}
            size={icons.md}
            color={active ? colors.iconWhite : colors.iconGray}
          />
        )}
      />

      <DrawerMenuItem
        label="Categories"
        onPress={() => {
          router.push("/search/categories");
        }}
        icon={({ active }) => (
          <Ionicons
            name={active ? "grid" : "grid-outline"}
            size={icons.md}
            color={active ? colors.iconWhite : colors.iconGray}
          />
        )}
      />
      <DrawerMenuItem
        label="Create Ad"
        onPress={() => {
          if (!isAuthenticated) {
            handleLogin();
            return;
          }
          router.push({ pathname: "/ads/create" });
        }}
        icon={({ active }) => (
          <MaterialCommunityIcons
            name="plus-box-outline"
            size={icons.md}
            color={active ? colors.iconWhite : colors.iconGray}
          />
        )}
      />

      <DrawerMenuItem
        label="Favorites"
        active={props.state.index === 2}
        onPress={() => {
          if (!isAuthenticated) {
            handleLogin();
            return;
          }
          props.navigation.navigate("favorites");
        }}
        icon={({ active }) => (
          <MaterialCommunityIcons
            name="heart-outline"
            size={icons.md}
            color={active ? colors.iconWhite : colors.iconGray}
          />
        )}
      />

      <DrawerMenuItem
        label="Messages"
        active={props.state.index === 3}
        count={chatStats?.unreadMessages}
        onPress={() => {
          if (!isAuthenticated) {
            handleLogin();
            return;
          }
          props.navigation.navigate("messages");
        }}
        icon={({ active }) => (
          <Feather
            name="message-square"
            size={icons.md}
            color={active ? colors.iconWhite : colors.iconGray}
          />
        )}
      />
      <DrawerMenuItem
        label="Notifications"
        active={props.state.index === 4}
        count={2}
        onPress={() => {
          props.navigation.navigate("notifications");
        }}
        icon={({ active }) => (
          <Feather
            name="bell"
            size={icons.md}
            color={active ? colors.iconWhite : colors.iconGray}
          />
        )}
      />
      {user?.sellerProfile && (
        <DrawerMenuItem
          label="Business"
          onPress={() => {
            if (!isAuthenticated) {
              handleLogin();
              return;
            }
            router.push("/account/business");
          }}
          icon={({ active }) => (
            <Ionicons
              name={active ? "business" : "business-outline"}
              size={icons.md}
              color={active ? colors.iconWhite : colors.iconGray}
            />
          )}
        />
      )}

      <DrawerMenuItem
        label="Profile"
        active={props.state.index === 1}
        onPress={() => {
          if (!isAuthenticated) {
            handleLogin();
            return;
          }
          props.navigation.navigate("profile");
        }}
        icon={({ active }) => (
          <MaterialCommunityIcons
            name={active ? "account" : "account-outline"}
            size={icons.md}
            color={active ? colors.iconWhite : colors.iconGray}
          />
        )}
      />
      <DrawerMenuItem
        label="Settings & Security"
        active={props.state.index === 5}
        onPress={() => {
          if (!isAuthenticated) {
            handleLogin();
            return;
          }
          props.navigation.navigate("settings");
        }}
        icon={({ active }) => (
          <Feather
            name="shield"
            size={icons.md}
            color={active ? colors.iconWhite : colors.iconGray}
          />
        )}
      />
      <DrawerMenuItem
        label="Help & Support"
        active={props.state.index === 6}
        onPress={() => {
          props.navigation.navigate("support");
        }}
        icon={({ active }) => (
          <Feather
            name="headphones"
            size={icons.md}
            color={active ? colors.iconWhite : colors.iconGray}
          />
        )}
      />
      <DrawerMenuItem
        label="About Us"
        active={props.state.index === 7}
        onPress={() => {
          props.navigation.navigate("about");
        }}
        icon={({ active }) => (
          <Feather
            name="info"
            size={icons.md}
            color={active ? colors.iconWhite : colors.iconGray}
          />
        )}
      />
      {/* PROMO CARD */}
      <DrawerPromoCard
        onPress={() => router.push({ pathname: "/account/business" })}
      />
      {/* LOGOUT */}

      {isAuthenticated && (
        <DrawerMenuItem
          label="Logout"
          onPress={handleLogout}
          labelStyle={{ color: colors.accentRed }}
          icon={() => (
            <Feather name="log-out" size={icons.md} color={colors.accentRed} />
          )}
        />
      )}
    </DrawerContentScrollView>
  );
}
