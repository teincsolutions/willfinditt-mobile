import ChatListItem from "@/components/chat/ChatListItem";
import DrawerHeaderToggle from "@/components/drawer/DrawerHeaderToggle";
import { SearchBar } from "@/components/search/SearchBar";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import { useAuth } from "@/hooks/useAuth";
import { useChats } from "@/hooks/useChats";
import { useTheme } from "@/hooks/useTheme";
import { Chat } from "@/types/chat";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import Drawer from "expo-router/drawer";
import { MessageText1 } from "iconsax-react-nativejs";
import { useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";

export default function MessagesScreen() {
  const { icons, spacing, colors } = useTheme();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const {
    data: chatsData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useChats({ limit: 20, search: searchQuery || undefined });

  const chats: Chat[] = chatsData?.pages.flatMap((page) => page.data) || [];

  const handleRefresh = async () => {
    await refetch();
  };

  const handleSearch = () => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setQuery("");
    setSearchQuery("");
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <AppView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.xl,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </AppView>
      );
    }

    return (
      <AppView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: spacing.md,
        }}
      >
        <MessageText1 size={64} color={colors.iconGray} variant="Bulk" />
        <AppText
          variant="lg"
          style={{
            color: colors.textGray,
            textAlign: "center",
            marginTop: spacing.md,
          }}
        >
          {searchQuery ? "No chats found" : "No messages yet"}
        </AppText>
        <AppText
          variant="sm"
          style={{
            color: colors.textGray,
            textAlign: "center",
            marginTop: spacing.sm,
          }}
        >
          {searchQuery
            ? "Try a different search term"
            : "Start a conversation by contacting a seller"}
        </AppText>
      </AppView>
    );
  };

  const renderHeader = () => {
    if (!isRefetching || isLoading) return null;

    return (
      <AppView
        style={{
          padding: spacing.md,
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="small" color={colors.primary} />
      </AppView>
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <AppView
        style={{
          padding: spacing.md,
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="small" color={colors.primary} />
      </AppView>
    );
  };

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <Drawer.Screen
        options={{
          header: () => (
            <Header
              left={<DrawerHeaderToggle style={{ marginStart: 0 }} />}
              right={
                <IconButton
                  onPress={() => setShowSearch(!showSearch)}
                  icon={
                    <Feather
                      name="search"
                      size={icons.md}
                      color={colors.iconBlack}
                    />
                  }
                />
              }
              title={"Messages"}
              containerStyle={{
                paddingHorizontal: spacing.md,
                paddingBottom: spacing.sm,
              }}
            >
              {showSearch && (
                <SearchBar
                  value={query}
                  onChangeText={setQuery}
                  onClear={handleClearSearch}
                  onSubmit={handleSearch}
                  placeholder="Search contacts..."
                  showSearchButton
                  autoFocus
                />
              )}
            </Header>
          ),
        }}
      />
      <FlatList
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ flexGrow: 1 }}
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatListItem
            onPress={() =>
              router.push({
                pathname: "/chats/[chatId]",
                params: { chatId: item.id },
              })
            }
            chat={item}
            currentUserId={user?.id || ""}
          />
        )}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={renderEmptyState()}
        ListFooterComponent={renderFooter()}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </AppView>
  );
}
