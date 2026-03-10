'use client';

import React, { useState } from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

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
                p: 2,
                bgcolor: 'white',
                borderTop: '1px solid rgba(0,0,0,0.04)',
                mt: 'auto',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'white',
                    borderRadius: 8,
                    border: '1px solid #E2E8F0',
                    px: 3,
                    py: 1,
                    gap: 2,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
                }}
            >
                <InputBase
                    fullWidth
                    placeholder="Start chat"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    sx={{
                        fontSize: '1rem',
                        '& input::placeholder': {
                            color: '#94A3B8',
                            opacity: 1,
                        },
                    }}
                />
                <IconButton
                    onClick={handleSend}
                    sx={{
                        color: 'white',
                        bgcolor: '#2EC2C9',
                        '&:hover': { bgcolor: '#24B1B8' },
                        width: 42,
                        height: 42,
                    }}
                >
                    <SendIcon sx={{ fontSize: 20 }} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatInput;
