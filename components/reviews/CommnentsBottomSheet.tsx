import BottomSheet from "@gorhom/bottom-sheet";
import React, { useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import InputField from "../ui/InputField";
import CommentsList from "./CommentsList";

export function CommentsBottomSheet({
  comments,
  onAddComment,
  onAddReply,
}: {
  comments: any[];
  onAddComment: (text: string) => void;
  onAddReply: (commentId: string, text: string) => void;
}) {
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
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        {/* Comments List */}
        <CommentsList comments={comments} onPressReply={handleReply} />

        {/* Input Bar */}
        <InputField
          onChangeText={setText}
          value={text}
          onSubmit={handleSubmit}
        />
      </KeyboardAvoidingView>
    </BottomSheet>
  );
}
