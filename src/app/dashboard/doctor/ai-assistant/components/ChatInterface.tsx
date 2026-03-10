'use client';

import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const INITIAL_MESSAGES = [
    {
        id: '1',
        content: "Hello! I'm your pre-consultation assistant. I'll help gather some information before your appointment with Dr. Ahmed. How are you feeling today?",
        time: '09:01',
        isAi: true,
        sender: 'AI',
    },
    {
        id: '2',
        content: "I've been having chest pain for the past 3 days. It comes and goes, usually after meals.",
        time: '09:02',
        isAi: false,
        sender: 'Dr.',
    },
    {
        id: '3',
        content: "I understand. Can you describe the pain? Is it sharp, dull, burning, or pressure-like?",
        time: '09:02',
        isAi: true,
        sender: 'AI',
    },
    {
        id: '4',
        content: "It's more like a burning sensation in the center of my chest. Sometimes it goes up to my throat.",
        time: '09:03',
        isAi: false,
        sender: 'Dr.',
    },
    {
        id: '5',
        content: "Thank you. Have you noticed any other symptoms like shortness of breath, nausea, or sweating?",
        time: '09:03',
        isAi: true,
        sender: 'AI',
    },
    {
        id: '6',
        content: "No shortness of breath, but I do feel a bit nauseous sometimes after eating.",
        time: '09:04',
        isAi: false,
        sender: 'P',
    },
    {
        id: '7',
        content: "Got it. Based on what you've described, I've prepared a summary for Dr. Ahmed. Your symptoms suggest possible GERD (gastroesophageal reflux), but cardiac causes will be evaluated too.",
        time: '09:04',
        isAi: true,
        sender: 'AI',
    },
];

const ChatInterface = () => {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);

    const handleSendMessage = (content: string) => {
        const newMessage = {
            id: Date.now().toString(),
            content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAi: false,
            sender: 'Dr.',
        };
        setMessages([...messages, newMessage]);

        // Mock AI response
        setTimeout(() => {
            const aiResponse = {
                id: (Date.now() + 1).toString(),
                content: "I'm processing that information. Let me add it to the patient summary.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isAi: true,
                sender: 'AI',
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                height: 'calc(100vh - 140px)',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'white',
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        bgcolor: 'rgba(0,0,0,0.05)',
                        borderRadius: '10px',
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
            </Box>
            <ChatInput onSendMessage={handleSendMessage} />
        </Paper>
    );
};

export default ChatInterface;
