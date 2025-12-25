import ChatListItem from "@/components/chat/ChatListItem";
import DrawerHeaderToggle from "@/components/drawer/DrawerHeaderToggle";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import { useTheme } from "@/hooks/useTheme";
import { Chat } from "@/types";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import Drawer from "expo-router/drawer";
import { FlatList } from "react-native";

export default function NotificationScreen() {
  const { icons, spacing, colors } = useTheme();

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <Drawer.Screen
        options={{
          header: () => (
            <Header
              left={<DrawerHeaderToggle style={{ marginStart: 0 }} />}
              right={
                <IconButton icon={<Feather name="search" size={icons.md} />} />
              }
              title={"Messages"}
              containerStyle={{
                paddingHorizontal: spacing.md,
                paddingBottom: spacing.lg,
              }}
            ></Header>
          ),
        }}
      />
      <FlatList
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: spacing.lg }}
        stickyHeaderIndices={[0]}
        data={[] as Chat[]}
        renderItem={({ item }) => (
          <ChatListItem
            onPress={() =>
              router.push({
                pathname: "/chats/[chatId]",
                params: { chatId: item.id },
              })
            }
            chat={item}
            currentUserId={"cmeg6qvzz0000mpa4cqbd56wd"}
          />
        )}
      />
    </AppView>
  );
}
