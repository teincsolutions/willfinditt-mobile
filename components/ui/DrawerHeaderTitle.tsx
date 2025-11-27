import { useTheme } from "@/hooks/useTheme";
import { Image, StyleSheet } from "react-native";
import AppText from "./AppText";
import AppView from "./AppView";

export default function DrawerHeaderTitle() {
  const { spacing } = useTheme();
  return (
    <AppView style={[styles.container, { gap: spacing.md }]}>
      <Image
        source={require("../../assets/images/icon.png")}
        style={{ width: 40, height: 40, resizeMode: "contain" }}
      />
      <AppText
        variant="xl"
        style={{
          textTransform: "uppercase",
        }}
      >
        <AppText style={{ fontWeight: "bold" }}>Will</AppText>
        <AppText>finditt</AppText>
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
