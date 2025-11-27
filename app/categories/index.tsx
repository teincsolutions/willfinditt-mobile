import { SearchBar } from "@/components/search/SearchBar";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import { Grid2 } from "iconsax-react-nativejs";
import { useState } from "react";

export default function CategoriesScreen() {
  const { icons, spacing } = useTheme();
  const [query, setQuery] = useState("");
  return (
    <AppView>
      <Stack.Screen
        options={{
          header: () => (
            <Header
              right={
                <IconButton
                  icon={<Grid2 variant="Outline" size={icons.md} />}
                />
              }
              title="All Categories"
              containerStyle={{
                paddingHorizontal: spacing.md,
                paddingBottom: spacing.lg,
              }}
            >
              <SearchBar value={query} onChangeText={setQuery} />
            </Header>
          ),
        }}
      />
    </AppView>
  );
}
