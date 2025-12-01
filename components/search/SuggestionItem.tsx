import { useTheme } from "@/contexts/ThemeContext";
import { Suggestion } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Clock } from "iconsax-react-nativejs";
import { Pressable } from "react-native";
import AppView from "../ui/AppView";
import { HighlightText } from "../ui/HighlightText";

interface SuggestionItemProps {
  suggestion: Suggestion;
  query: string;
  isRecent?: boolean;
  onPress?: () => void;
  onRemoveItem?: () => void;
}

export function SuggestionItem({
  suggestion,
  query,
  isRecent,
  onPress,
  onRemoveItem,
}: SuggestionItemProps) {
  const { colors, icons, spacing } = useTheme();
  return (
    <Pressable onPress={onPress}>
      <AppView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: spacing.sm,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
        }}
      >
        {isRecent && <Clock size={icons.sm} color={colors.textGray} />}
        <HighlightText
          style={{ flex: 1 }}
          query={query}
          text={suggestion.keyword}
        />
        {isRecent && (
          <Ionicons
            name="close"
            style={{ padding: spacing.xs }}
            onPress={onRemoveItem}
            size={icons.sm}
            color={colors.textGray}
          />
        )}
      </AppView>
    </Pressable>
  );
}
