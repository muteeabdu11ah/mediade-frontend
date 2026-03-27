"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PauseIcon from "@mui/icons-material/Pause";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  COLORS,
  GRADIENTS,
  BORDER_RADIUS,
  SHADOWS,
} from "@/lib/constants/design-tokens";
import axios from "axios";
import ChatMessage from "@/app/dashboard/doctor/ai-assistant/components/ChatMessage";

interface ConsultationInterfaceProps {
  consultationId: string;
}

interface TranscriptMessage {
  id: string;
  content: string;
  time: string;
  isAi: boolean;
  sender: string;
}

const ConsultationInterface: React.FC<ConsultationInterfaceProps> = ({
  consultationId,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [transcriptExpanded, setTranscriptExpanded] = useState(true);
  const [consultation, setConsultation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [waveformHeights, setWaveformHeights] = useState<number[]>(
    Array.from({ length: 50 }, () => Math.random() * 60 + 40),
  );

  // Mock transcript messages - in a real app, these would come from your backend
  const [transcriptMessages] = useState<TranscriptMessage[]>([
    {
      id: "1",
      content:
        "Good morning, Sarah. How have you been feeling since our last visit?",
      time: "00:15",
      isAi: true,
      sender: "Dr.",
    },
    {
      id: "2",
      content:
        "Good morning, Doctor. I've been feeling better overall. The headaches have reduced significantly.",
      time: "00:28",
      isAi: false,
      sender: "P",
    },
    {
      id: "3",
      content:
        "That's great to hear. Have you been taking the Amlodipine regularly?",
      time: "00:42",
      isAi: true,
      sender: "Dr.",
    },
    {
      id: "4",
      content:
        "Yes, every morning with breakfast. I did notice some ankle swelling last week though.",
      time: "00:55",
      isAi: false,
      sender: "P",
    },
    {
      id: "5",
      content:
        "Ankle edema can be a side effect. Let me check your blood pressure today and we can discuss adjusting the dosage if needed.",
      time: "01:12",
      isAi: true,
      sender: "Dr.",
    },
  ]);

  useEffect(() => {
    // Fetch consultation details
    const fetchConsultation = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/onsite-consultations/${consultationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setConsultation(response.data);
      } catch (error) {
        console.error("Failed to fetch consultation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [consultationId]);

  useEffect(() => {
    // Recording timer
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    // Smooth waveform animation
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setWaveformHeights(
          Array.from({ length: 50 }, () => Math.random() * 60 + 40),
        );
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleEndConsultation = () => {
    router.push(`/dashboard/doctor/direct-visit/soap-note/${consultationId}`);
  };

  const handlePause = () => {
    setIsRecording(!isRecording);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const doctorName = user
    ? `Dr. ${user.firstName} ${user.lastName}`
    : "Dr. John Doe";
  const doctorSpecialty = user?.doctorProfile?.specialty || "Physiotherapist";
  const patientName = consultation
    ? `${consultation.firstName} ${consultation.lastName}`
    : "Joe Philips";
  const patientInfo = "Patient / 72 / Male";

  return (
    <Paper
      elevation={0}
      sx={{
        height: "calc(100vh - 140px)",
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
        borderRadius: 2,
        width: "full",
        overflow: "hidden",
        border: "2px solid transparent",

        boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
      }}
    >
      {/* Header with Doctor and Patient Info */}
      <Box
        sx={{
          p: 3,
          bgcolor: COLORS.background.paper,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "40px",
          }}
        >
          {/* Doctor Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={user?.profileImageUrl || undefined}
              sx={{
                width: 56,
                height: 56,
                background: GRADIENTS.primary,
                border: `4px solid #BDD4FB`,
                boxShadow: SHADOWS.medium,
              }}
            >
              DR
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
                color={COLORS.text.primary}
              >
                {doctorName}
              </Typography>
              <Typography variant="body2" color={COLORS.text.secondary}>
                {doctorSpecialty}
              </Typography>
            </Box>
          </Box>

          {/* Divider */}
          <Box
            sx={{
              width: "1px",
              height: 60,
              background: "linear-gradient(90deg, #009BE8 0%, #00C9AB 100%)",
              borderRadius: 1,
              mx: 0,
            }}
          />

          {/* Patient Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: COLORS.primary.subtle,
                color: COLORS.primary.main,
                fontSize: "1.5rem",
                fontWeight: 700,
                border: `4px solid #BDD4FB`,
              }}
            >
              {patientName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
                color={COLORS.text.primary}
              >
                {patientName}
              </Typography>
              <Typography variant="body2" color={COLORS.text.secondary}>
                {patientInfo}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Audio Waveform Section */}
      <Box
        sx={{
          py: 3,
          px: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "white",
        }}
      >
        {/* Waveform Container with background */}
        <Box
          sx={{
            width: 400,
            bgcolor: "#F6FBFF",
            borderRadius: 3,
            py: 2,
            px: 3,
          }}
        >
          {/* Waveform Visualization */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton
              sx={{
                color: isRecording ? COLORS.error.main : COLORS.text.muted,
                bgcolor: isRecording ? "#FFE5E5" : COLORS.background.subtle,
                "&:hover": {
                  bgcolor: isRecording ? "#FFE5E5" : COLORS.background.paper,
                },
              }}
            >
              {isRecording ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            {/* Waveform bars */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.3,
                flex: 1,
                height: 34,
              }}
            >
              {waveformHeights.map((height, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    minWidth: 2,
                    height: `${height}%`,
                    background:
                      "linear-gradient(180deg, #009BE8 0%, #00C9AB 100%)",
                    borderRadius: 1,
                    transition: "height 0.15s ease-in-out",
                    opacity: isRecording ? 1 : 0.3,
                  }}
                />
              ))}
            </Box>

            <Typography
              variant="h6"
              fontWeight={600}
              color={COLORS.text.primary}
              sx={{ minWidth: 60 }}
            >
              {formatTime(recordingTime)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Live Transcription Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 3,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            pb: 2,
            borderBottom: `1px solid ${COLORS.border.light}`,
          }}
        >
          <VolumeUpIcon sx={{ color: COLORS.primary.main }} />
          <Typography variant="h6" fontWeight={600}>
            Live Transcription
          </Typography>
          <FormControl size="small" sx={{ ml: "auto", minWidth: 150 }}>
            <Select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              sx={{ borderRadius: BORDER_RADIUS.sm }}
            >
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Spanish">Spanish</MenuItem>
              <MenuItem value="French">French</MenuItem>
            </Select>
          </FormControl>
          <IconButton
            size="small"
            onClick={() => setTranscriptExpanded(!transcriptExpanded)}
          >
            <ExpandMoreIcon
              sx={{
                transform: transcriptExpanded ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.3s",
              }}
            />
          </IconButton>
        </Box>

        {/* Messages */}
        {transcriptExpanded && (
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              pr: 1,
              minHeight: 0,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "rgba(0,0,0,0.05)",
                borderRadius: "10px",
              },
            }}
          >
            {transcriptMessages.map((msg) => (
              <ChatMessage
                key={msg.id}
                content={msg.content}
                time={msg.time}
                isAi={msg.isAi}
                sender={msg.sender}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${COLORS.border.light}`,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          bgcolor: COLORS.background.paper,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<PauseIcon />}
          onClick={handlePause}
          sx={{
            borderRadius: BORDER_RADIUS.md,
            px: 3,
            py: 0.75,
            borderColor: COLORS.primary.main,
            color: COLORS.primary.main,
            "&:hover": {
              borderColor: COLORS.primary.main,
              bgcolor: COLORS.primary.subtle,
            },
          }}
        >
          {isRecording ? "Pause" : "Resume"}
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleEndConsultation}
          sx={{
            borderRadius: BORDER_RADIUS.md,
            px: 3,
            py: 0.75,
            bgcolor: COLORS.error.main,
            color: "white",
            "&:hover": {
              bgcolor: COLORS.error.main,
            },
          }}
        >
          End Consultation
        </Button>
      </Box>
    </Paper>
  );
};

export default ConsultationInterface;
