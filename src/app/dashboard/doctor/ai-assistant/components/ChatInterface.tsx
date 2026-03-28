"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, Paper } from "@mui/material";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useChat } from "@/hooks/use-chat";
import { RichContent } from "@/lib/types";

const INITIAL_MESSAGES = [
  {
    id: "1",
    content:
      "Hello! I'm your pre-consultation assistant. I'll help gather some information before your appointment with Dr. Ahmed. How are you feeling today?",
    time: "09:01",
    isAi: true,
    sender: "AI",
  },
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<
    {
      id: string;
      content: string | RichContent;
      time: string;
      isAi: boolean;
      sender: string;
    }[]
  >(INITIAL_MESSAGES);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { mutate: sendMessage, isPending } = useChat();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      content,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isAi: false,
      sender: "Dr.",
    };
    setMessages((prev) => [...prev, userMessage]);

    sendMessage(
      { user_input: content },
      {
        onSuccess: (data) => {
          const aiMessage = {
            id: (Date.now() + 1).toString(),
            content: data.response,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isAi: true,
            sender: "AI",
          };
          setMessages((prev: typeof messages) => [...prev, aiMessage]);
        },
        onError: () => {
          const errorMessage = {
            id: (Date.now() + 1).toString(),
            content: "Something went wrong. Please try again.",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isAi: true,
            sender: "AI",
          };
          setMessages((prev) => [...prev, errorMessage]);
        },
      },
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: "calc(100vh - 140px)",
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 4,
          display: "flex",
          flexDirection: "column",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(0,0,0,0.05)",
            borderRadius: "10px",
          },
        }}
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            content={msg.content}
            time={msg.time}
            isAi={msg.isAi}
            sender={msg.sender}
          />
        ))}
        {isPending && (
          <ChatMessage content="..." time="" isAi={true} sender="AI" />
        )}
        <div ref={bottomRef} />
      </Box>

      <ChatInput onSendMessage={handleSendMessage} disabled={isPending} />
    </Paper>
  );
};

export default ChatInterface;
