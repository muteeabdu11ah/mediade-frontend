"use client";

import React from "react";
import { Box, Typography, Avatar, Link } from "@mui/material";
import { COLORS, BORDER_RADIUS, SHADOWS } from "@/lib/constants/design-tokens";
import { ChatReference } from "@/lib/types";

interface RichContent {
  reasoning: string;
  possible_conditions: string[];
  references: ChatReference[];
}

interface ChatMessageProps {
  content: string | RichContent;
  time: string;
  isAi: boolean;
  sender: string;
}

const isRichContent = (content: string | RichContent): content is RichContent =>
  typeof content === "object" && "reasoning" in content;

const RichAiMessage: React.FC<{ content: RichContent }> = ({ content }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
    {/* Reasoning */}
    <Typography variant="body2" sx={{ lineHeight: 1.6, fontSize: "0.95rem" }}>
      {content.reasoning}
    </Typography>

    {/* Possible Conditions */}
    {content.possible_conditions?.length > 0 && (
      <Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            fontSize: "0.85rem",
            color: COLORS.primary.main,
            mb: 0.5,
          }}
        >
          Possible Conditions
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
          {content.possible_conditions.map((condition, i) => (
            <Box component="li" key={i}>
              <Typography
                variant="body2"
                sx={{ fontSize: "0.9rem", lineHeight: 1.7 }}
              >
                {condition}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    )}

    {/* References */}
    {content.references?.length > 0 && (
      <Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            fontSize: "0.85rem",
            color: COLORS.primary.main,
            mb: 0.5,
          }}
        >
          References
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          {content.references.map((ref, i) => (
            <Box key={i} sx={{ display: "flex", flexDirection: "column" }}>
              <Link
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: COLORS.primary.main,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {ref.title} ↗
              </Link>
              <Typography
                variant="caption"
                sx={{ color: COLORS.text.muted, fontSize: "0.78rem" }}
              >
                {ref.reason}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    )}
  </Box>
);

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  time,
  isAi,
  sender,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isAi ? "flex-start" : "flex-end",
        mb: 4,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isAi ? "row" : "row-reverse",
          alignItems: "flex-start",
          gap: 1.5,
          maxWidth: "85%",
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: "0.75rem",
            bgcolor: isAi ? COLORS.primary.subtle : COLORS.secondary.subtle,
            color: isAi ? COLORS.primary.main : COLORS.secondary.main,
            border: `1px solid ${isAi ? COLORS.primary.light : COLORS.secondary.light}44`,
          }}
        >
          {sender}
        </Avatar>
        <Box
          sx={{
            bgcolor: isAi ? COLORS.background.paper : COLORS.primary.subtle,
            color: COLORS.text.primary,
            p: 2.5,
            borderRadius: isAi ? "0 16px 16px 16px" : "16px 0 16px 16px",
            boxShadow: SHADOWS.small,
            border: `1px solid ${isAi ? COLORS.border.light : COLORS.primary.subtle}`,
          }}
        >
          {isRichContent(content) ? (
            <RichAiMessage content={content} />
          ) : (
            <Typography
              variant="body2"
              sx={{ lineHeight: 1.6, fontSize: "0.95rem" }}
            >
              {content}
            </Typography>
          )}
        </Box>
      </Box>
      <Typography
        variant="caption"
        sx={{ mt: 1, color: COLORS.text.muted, px: isAi ? 6 : 6 }}
      >
        {time}
      </Typography>
    </Box>
  );
};

export default ChatMessage;
