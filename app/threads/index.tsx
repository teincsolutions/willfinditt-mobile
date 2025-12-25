import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { BackButton } from "@/components/ui/BackButton";
import { Header } from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useCreateThread, useThreads } from "@/hooks/useThreads";
import { ThreadStatus, ThreadType } from "@/types/enums";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";

import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";

export default function ThreadsScreen() {
  const { data: threads = [], isLoading } = useThreads();
  const { user } = useAuth();
  const { colors, spacing, icons } = useTheme();
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");

  const createThreadMutation = useCreateThread();

  const handleCreateThread = async () => {
    if (newThreadTitle.trim()) {
      try {
        const newThread = await createThreadMutation.mutateAsync({
          title: newThreadTitle.trim(),
          type: ThreadType.SUPPORT,
        });
        setNewThreadTitle("");
        setShowCreateForm(false);
        router.push(`/threads/${newThread.id}`);
      } catch (error) {
        // Error is already handled by the hook's onError callback
        // Form stays visible so user can try again
      }
    }
  };

  const getStatusColor = (status: ThreadStatus) => {
    switch (status) {
      case ThreadStatus.OPEN:
        return colors.success;
      case ThreadStatus.CLOSED:
        return colors.error;
      case ThreadStatus.PENDING:
        return colors.warning;
      default:
        return colors.textGray;
    }
  };

  const renderThreadItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
      }}
      onPress={() => router.push(`/threads/${item.id}`)}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <AppText style={{ fontWeight: "bold", flex: 1 }}>{item.title}</AppText>
        <AppText
          style={{
            color: getStatusColor(item.status),
            fontSize: 12,
            textTransform: "uppercase",
          }}
        >
          {item.status}
        </AppText>
      </View>
      <AppView style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <AppText style={{ color: colors.textGray, fontSize: 12, marginTop: spacing.xs }}>
        {item?.lastMessage || "No message"}
      </AppText>
       <AppText style={{ color: colors.textGray, fontSize: 12, marginTop: spacing.xs }}>
        {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
      </AppText>
      </AppView>
    </TouchableOpacity>
  );

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <Stack.Screen
        options={{
          title: "Support Threads",
          header: () => (
            <Header
              title="Support Threads"
              navRowStyle={{ paddingHorizontal: spacing.md }}
              containerStyle={{ paddingBottom: spacing.sm }}
              left={<BackButton />}
              right={
                <IconButton
                  icon={<Ionicons name="add" size={icons.md} color={colors.iconBlack} />}
                  onPress={() => setShowCreateForm(!showCreateForm)}
                />
              }
            />
          ),
        }}
      />
      {showCreateForm && (
        <View
          style={{
            padding: spacing.md,
            backgroundColor: colors.backgroundSecondary,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <TextInput
            placeholder="What issue are you facing?"
            value={newThreadTitle}
            onChangeText={setNewThreadTitle}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              padding: spacing.sm,
              backgroundColor: colors.backgroundPrimary,
              color: colors.text,
            }}
          />
          <View style={{ flexDirection: "row", marginTop: spacing.sm }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.primary,
                padding: spacing.sm,
                borderRadius: 8,
                marginRight: spacing.sm,
              }}
              onPress={handleCreateThread}
              disabled={createThreadMutation.isPending}
            >
              <AppText style={{ color: colors.textWhite, textAlign: "center" }}>
                {createThreadMutation.isPending ? "Creating..." : "Create"}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.backgroundPrimary,
                padding: spacing.sm,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              onPress={() => {
                setShowCreateForm(false);
                setNewThreadTitle("");
              }}
            >
              <AppText style={{ textAlign: "center" }}>Cancel</AppText>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {isLoading ? (
        <AppText style={{ textAlign: "center", marginTop: spacing.xl }}>
          Loading threads...
        </AppText>
      ) : threads.length === 0 ? (
        <AppText style={{ textAlign: "center", marginTop: spacing.xl }}>
          No threads found. Tap the + button to create a new support thread.
        </AppText>
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(item) => item.id}
          renderItem={renderThreadItem}
        />
      )}
    </AppView>
  );
}
