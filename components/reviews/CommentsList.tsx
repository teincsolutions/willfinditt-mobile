import React from "react";
import { FlatList, View } from "react-native";
import { CommentItem } from "./CommentItem";
import { ReplyItem } from "./ReplyItem";

export default function CommentsList({
  comments,
  onPressReply,
}: {
  comments: any[];
  onPressReply: (commentId: string) => void;
}) {
  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 40 }}
      renderItem={({ item }) => (
        <View>
          <CommentItem
            avatar={item.avatar}
            name={item.name}
            text={item.text}
            time={item.time}
            repliesCount={item.replies?.length || 0}
            onPressReplies={() => onPressReply(item.id)}
          />

          {item.replies?.map((reply: any) => (
            <ReplyItem
              key={reply.id}
              avatar={reply.avatar}
              name={reply.name}
              text={reply.text}
              time={reply.time}
            />
          ))}
        </View>
      )}
    />
  );
}
