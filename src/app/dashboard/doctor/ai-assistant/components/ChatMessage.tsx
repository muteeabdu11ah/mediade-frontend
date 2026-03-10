'use client';

import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

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
                    maxWidth: '80%',
                }}
            >
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        bgcolor: isAi ? 'rgba(46, 194, 201, 0.1)' : 'rgba(46, 194, 201, 0.1)',
                        color: isAi ? '#2EC2C9' : '#1fb2ba',
                        border: '1px solid rgba(46, 194, 201, 0.2)',
                    }}
                >
                    {sender}
                </Avatar>
                <Box
                    sx={{
                        bgcolor: isAi ? 'rgba(46, 194, 201, 0.05)' : 'rgba(46, 194, 201, 0.15)',
                        color: '#1A2B3C',
                        p: 2.5,
                        borderRadius: isAi ? '0 20px 20px 20px' : '20px 0 20px 20px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
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
                    color: '#64748B',
                    fontWeight: 500,
                    px: isAi ? 6 : 6,
                }}
            >
                {time}
            </Typography>
        </Box>
    );
};

export default ChatMessage;
