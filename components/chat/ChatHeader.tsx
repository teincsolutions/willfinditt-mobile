import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import { Header } from "../ui/Header";
import IconButton from "../ui/IconButton";

interface ChatHeaderProps {
  name: string;
  isOnline?: boolean;
  onCall?: () => void;
}
export default function ChatHeader({
  name,
  isOnline,
  onCall,
}: ChatHeaderProps) {
  const { colors, icons } = useTheme();

  return (
    <Header
      title={
        <AppView>
          <AppText variant="lg">{name}</AppText>
          <AppText variant="sm"> {isOnline ? "Online" : "Offline"}</AppText>
        </AppView>
      }
      left={
        <IconButton
          icon={<Ionicons size={icons.md} color={colors.iconBlack} />}
        />
      }
    />
  );
}