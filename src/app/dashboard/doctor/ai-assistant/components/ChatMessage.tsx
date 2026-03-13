'use client';

import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { COLORS, BORDER_RADIUS, SHADOWS } from '@/lib/constants/design-tokens';

interface ChatMessageProps {
    content: string;
    time: string;
    isAi: boolean;
    sender: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, time, isAi, sender }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isAi ? 'flex-start' : 'flex-end',
                mb: 4,
                width: '100%',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isAi ? 'row' : 'row-reverse',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    maxWidth: '85%',
                }}
            >
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        fontSize: '0.75rem',
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
                        borderRadius: isAi ? '0 16px 16px 16px' : '16px 0 16px 16px',
                        boxShadow: SHADOWS.small,
                        border: `1px solid ${isAi ? COLORS.border.light : COLORS.primary.subtle}`,
                    }}
                >
                    <Typography variant="body2" sx={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                        {content}
                    </Typography>
                </Box>
            </Box>
            <Typography
                variant="caption"
                sx={{
                    mt: 1,
                    color: COLORS.text.muted,
                    px: isAi ? 6 : 6,
                }}
            >
                {time}
            </Typography>
        </Box>
    );
};

export default ChatMessage;
