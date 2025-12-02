import { useTheme } from "@/hooks/useTheme";
import React, { useRef, useState } from "react";
import {
    Modal,
    Pressable,
    StyleProp,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import AppText from "./AppText";

export interface PopupMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

type Props = {
  trigger: React.ReactNode;
  items: PopupMenuItem[];
  triggerStyle?: StyleProp<ViewStyle>;
  menuStyle?: StyleProp<ViewStyle>;
  placement?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

export default function PopupMenu({
  trigger,
  items,
  triggerStyle,
  menuStyle,
  placement = "bottom-right",
}: Props) {
  const { colors, spacing, radius, shadows } = useTheme();
  const [visible, setVisible] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const triggerRef = useRef<View>(null);

  const handleTriggerPress = () => {
    triggerRef.current?.measure(
      (
        x: number,
        y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number
      ) => {
        setTriggerLayout({ x: pageX, y: pageY, width, height });
        setVisible(true);
      }
    );
  };

  const handleItemPress = (item: PopupMenuItem) => {
    setVisible(false);
    if (!item.disabled) {
      item.onPress();
    }
  };

  const getMenuPosition = () => {
    const menuWidth = 200;
    const menuMaxHeight = items.length * 56;

    switch (placement) {
      case "top-left":
        return {
          top: triggerLayout.y - menuMaxHeight - spacing.xs,
          left: triggerLayout.x - menuWidth,
        };
      case "top-right":
        return {
          top: triggerLayout.y - menuMaxHeight - spacing.xs,
          left: triggerLayout.x + triggerLayout.width + spacing.xs,
        };
      case "bottom-left":
        return {
          top: triggerLayout.y + triggerLayout.height + spacing.xs,
          right: triggerLayout.width + spacing.xs,
        };
      case "bottom-right":
      default:
        return {
          top: triggerLayout.y + triggerLayout.height + spacing.xs,
          left: triggerLayout.x + triggerLayout.width,
        };
    }
  };

  return (
    <>
      {/* Trigger */}
      <Pressable
        onPress={handleTriggerPress}
        style={triggerStyle}
        ref={triggerRef}
      >
        {trigger}
      </Pressable>

      {/* Modal Overlay */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
          onPress={() => setVisible(false)}
        >
          {/* Menu */}
          <View
            style={[
              {
                position: "absolute",
                width: 200,
                backgroundColor: colors.background,
                borderRadius: radius.md,
                ...shadows,
                borderWidth: 1,
                borderColor: colors.border,
                overflow: "hidden",
              },
              getMenuPosition(),
              menuStyle,
            ]}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleItemPress(item)}
                disabled={item.disabled}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.md,
                  gap: spacing.sm,
                  backgroundColor: colors.background,
                  borderBottomWidth: index < items.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                  opacity: item.disabled ? 0.5 : 1,
                }}
                activeOpacity={0.7}
              >
                {item.icon && <View>{item.icon}</View>}
                <AppText
                  variant="md"
                  style={{
                    color: item.destructive ? colors.error : colors.text,
                    flex: 1,
                  }}
                >
                  {item.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
