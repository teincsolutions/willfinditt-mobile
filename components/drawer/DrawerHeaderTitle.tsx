import { useTheme } from "@/hooks/useTheme";
import { Image, StyleSheet } from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";

export default function DrawerHeaderTitle() {
  const { spacing } = useTheme();
  return (
    <AppView style={[styles.container, { gap: spacing.md }]}>
      <Image
        source={require("../../assets/images/icon.png")}
        style={{ width: 40, height: 40, resizeMode: "contain" }}
      />
      <AppText
        style={{
          textTransform: "uppercase",
        }}
      >
        <AppText variant="xl" style={{ fontWeight: "bold" }}>
          Will
        </AppText>
        <AppText variant="xl">finditt</AppText>
      </AppText>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
