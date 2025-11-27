import { useTheme } from "@/contexts/ThemeContext";
import { Feather } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import CommentsList from "./CommentsList";

export default function CommentsBottomSheet({
  comments,
  onAddComment,
  onAddReply,
}: {
  comments: any[];
  onAddComment: (text: string) => void;
  onAddReply: (commentId: string, text: string) => void;
}) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["50%", "90%"], []);

  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!text.trim()) return;

    if (replyingTo) {
      onAddReply(replyingTo, text.trim());
    } else {
      onAddComment(text.trim());
    }

    setText("");
    setReplyingTo(null);
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  return (
    <BottomSheet ref={sheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        {/* Comments List */}
        <CommentsList comments={comments} onPressReply={handleReply} />

        {/* Input Bar */}
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: theme.colors.white,
              padding: theme.spacing.md,
              borderTopColor: theme.colors.gray200,
            },
          ]}
        >
          <TextInput
            placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
            placeholderTextColor={theme.colors.gray400}
            value={text}
            onChangeText={setText}
            style={[
              styles.input,
              theme.typography.body,
              { color: theme.colors.black, marginRight: theme.spacing.md },
            ]}
          />

          <TouchableOpacity style={styles.sendBtn} onPress={handleSubmit}>
            <Feather name="send" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    inputBar: {
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: 1,
    },
    input: {
      flex: 1,
    },
    sendBtn: {
      padding: 6,
    },
  });
