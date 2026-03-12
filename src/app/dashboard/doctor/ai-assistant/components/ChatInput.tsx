'use client';

import React, { useState } from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { COLORS, BORDER_RADIUS, SHADOWS, GRADIENTS } from '@/lib/constants/design-tokens';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <Box
            sx={{
                p: 3,
                bgcolor: COLORS.background.paper,
                borderTop: `1px solid ${COLORS.border.light}`,
                mt: 'auto',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: COLORS.background.default,
                    borderRadius: BORDER_RADIUS.full,
                    border: `1px solid ${COLORS.border.medium}`,
                    pl: 4,
                    pr: 1,
                    py: 1,
                    gap: 2,
                    boxShadow: SHADOWS.premium,
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    '&:focus-within': {
                        borderColor: COLORS.primary.main,
                        boxShadow: `0 0 0 4px ${COLORS.primary.subtle}`,
                    }
                }}
            >
                <InputBase
                    fullWidth
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    sx={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: COLORS.text.primary,
                        '& input::placeholder': {
                            color: COLORS.text.muted,
                            opacity: 1,
                            fontWeight: 500
                        },
                    }}
                />
                <IconButton
                    onClick={handleSend}
                    sx={{
                        color: COLORS.primary.contrast,
                        background: GRADIENTS.primary,
                        '&:hover': {
                            boxShadow: SHADOWS.medium,
                            transform: 'scale(1.05)'
                        },
                        width: 48,
                        height: 48,
                        transition: 'all 0.23s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    <SendIcon sx={{ fontSize: 24 }} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatInput;
