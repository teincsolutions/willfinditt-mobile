import React from "react";
import ChatBubble from "./ChatBubble";

export default function ChatBubbleLeft({
  text,
  time,
}: {
  text: string;
  time?: string;
}) {
  return <ChatBubble text={text} time={time} isSender={false} />;
}
