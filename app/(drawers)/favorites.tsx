import ProductCard from "@/components/ads/ProductCard";
import ProductCardSkeleton from "@/components/ads/ProductCardSkeleton";
import DrawerHeaderToggle from "@/components/drawer/DrawerHeaderToggle";
import { SearchBar } from "@/components/search/SearchBar";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import PopupMenu, { PopupMenuItem } from "@/components/ui/PopupMenu";
import SecondaryTextButton from "@/components/ui/SecondaryTextButton";
import { useInfiniteSavedAds, useUnsaveAd } from "@/hooks/useAds";
import { useTheme } from "@/hooks/useTheme";
import { Ad } from "@/types/ad";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import Drawer from "expo-router/drawer";
import { Trash } from "iconsax-react-nativejs";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MasonryList from "reanimated-masonry-list";

export default function FavoritesScreen() {
  const { icons, spacing, colors, shadows } = useTheme();
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const inserts = useSafeAreaInsets();

  // Fetch saved ads
  const {
    data: savedAdsData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteSavedAds({ limit: 20 });
  const { mutate: unsaveAd, isPending: isUnsaving } = useUnsaveAd();

  const savedAds: Ad[] = savedAdsData?.pages.flatMap((page) => page.data) || [];

  // Only show skeletons on initial load when there's no data yet
  const showSkeletons = isLoading && savedAds.length === 0;

  // Filter ads based on search query
  const filteredAds = query
    ? savedAds.filter((ad) =>
        ad.title.toLowerCase().includes(query.toLowerCase())
      )
    : savedAds;

  const handleToggleSelection = (adId: string, selected: boolean) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(adId);
      } else {
        newSet.delete(adId);
      }
      return newSet;
    });
  };

  const handleCancelSelection = () => {
    setSelection(false);
    setSelectedItems(new Set());
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach((adId) => {
      unsaveAd(adId);
    });
    handleCancelSelection();
  };

  const menuItems: PopupMenuItem[] = [
    {
      id: "select",
      label: "Select",
      onPress: () => setSelection(true),
    },
  ];

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.background }}>
      <Drawer.Screen
        options={{
          header: () => (
            <Header
              backgroundColor={colors.backgroundPrimary}
              left={
                selection ? (
                  <SecondaryTextButton
                    variant="lg"
                    title="Cancel"
                    onPress={handleCancelSelection}
                  />
                ) : (
                  <DrawerHeaderToggle style={{ marginStart: 0 }} />
                )
              }
              leftSideStyle={{ marginLeft: spacing.md }}
              right={
                <PopupMenu
                  trigger={
                    <Feather
                      color={colors.iconBlack}
                      name="more-vertical"
                      size={icons.md}
                    />
                  }
                  items={menuItems}
                  placement="bottom-left"
                />
              }
              title="Favorites"
              containerStyle={{
                paddingVertical: spacing.sm,
              }}
            >
              <SearchBar
                style={{ marginHorizontal: spacing.md }}
                value={query}
                onChangeText={setQuery}
              />
            </Header>
          ),
        }}
      />
      <MasonryList
        style={{
          gap: spacing.sm,
          paddingHorizontal: spacing.md,
          paddingTop: spacing.md,
          paddingBottom: inserts.bottom + spacing.md,
          flexGrow: 1,
        }}
        data={showSkeletons ? Array(6).fill({}) : filteredAds}
        numColumns={2}
        keyExtractor={(item, index) => item.id || `skeleton-${index}`}
        renderItem={({ item, index }: any) => {
          if (showSkeletons) {
            return <ProductCardSkeleton />;
          }
          return (
            <ProductCard
              selectMode={selection}
              isSelected={selectedItems.has(item.id)}
              onSelectToggle={(selected) =>
                handleToggleSelection(item.id, selected)
              }
              onPress={() =>
                router.push({ pathname: "/[adId]", params: { adId: item.id } })
              }
              showFavoriteButton={false}
              onLongPress={()=>{
                handleToggleSelection(item.id, true);
                setSelection(true); 
              }}
              ad={item}
            />
          );
        }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{}}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      />
      {selection && (
        <AppView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: spacing.md,
            paddingBottom: inserts.bottom + spacing.md,
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            elevation: 5,
            shadowColor:shadows.shadowColor,
            shadowOffset:shadows.shadowOffset,
            shadowOpacity:shadows.shadowOpacity,
            shadowRadius:shadows.shadowRadius,
          }}
        >
          <AppText variant="lg" style={{ fontWeight: "600" }}>
            {selectedItems.size} selected
          </AppText>
          <SecondaryTextButton
            variant="lg"
            title="Delete"
            onPress={handleDeleteSelected}
            disabled={selectedItems.size === 0 || isUnsaving}
            icon={<Trash size={icons.md} color={colors.error} />}
            titleStyle={{ color: colors.error }}
          />
        </AppView>
      )}
    </AppView>
  );
}
