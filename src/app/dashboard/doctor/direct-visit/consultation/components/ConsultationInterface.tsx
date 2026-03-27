"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { useTranscribe } from "@/hooks/use-transcribe";

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

// Silence detection config
const SILENCE_THRESHOLD = 0.015; // amplitude below this = silence
const SILENCE_DURATION_MS = 1000; // pause duration to trigger send
const MIN_CHUNK_MS = 1000; // minimum chunk length to bother sending

const ConsultationInterface: React.FC<ConsultationInterfaceProps> = ({
  consultationId,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [transcriptExpanded, setTranscriptExpanded] = useState(true);
  const [consultation, setConsultation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [waveformHeights, setWaveformHeights] = useState<number[]>(
    Array.from({ length: 50 }, () => Math.random() * 60 + 40),
  );
  const [transcriptMessages, setTranscriptMessages] = useState<
    TranscriptMessage[]
  >([]);

  // Refs for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chunkStartTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number | null>(null);
  const isRecordingRef = useRef(isRecording);

  // Speaker tracking — ref avoids re-renders on every turn flip
  const currentSpeakerRef = useRef<"doctor" | "patient">("doctor");

  const { mutate: transcribe } = useTranscribe();

  // Keep ref in sync with state
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Send collected audio chunk to API
  const sendAudioChunk = useCallback(
    (audioBlob: Blob, langCode: string) => {
      const chunkId = crypto.randomUUID();

      // Capture the current speaker BEFORE the async call
      const speaker = currentSpeakerRef.current;

      const formData = new FormData();
      formData.append("file", audioBlob, "chunk.webm");
      formData.append("chunk_id", chunkId);
      formData.append("language_code", langCode);

      transcribe(formData, {
        onSuccess: (data) => {
          if (!data.transcript?.trim()) return;

          const isDoctor = speaker === "doctor";

          const newMessage: TranscriptMessage = {
            id: data.chunk_id,
            content: data.transcript,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            // isAi: true  → right-aligned bubble (Doctor)
            // isAi: false → left-aligned bubble  (Patient)
            isAi: isDoctor,
            sender: isDoctor ? "DR" : "P",
          };

          setTranscriptMessages((prev) => [...prev, newMessage]);

          // Flip speaker AFTER a successful, non-empty transcription
          currentSpeakerRef.current =
            currentSpeakerRef.current === "doctor" ? "patient" : "doctor";
        },
      });
    },
    [transcribe],
  );

  // Silence detection loop
  const startSilenceDetection = useCallback(
    (stream: MediaStream, langCode: string) => {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 512;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.fftSize);

      const checkSilence = () => {
        if (!isRecordingRef.current) return;

        analyser.getByteTimeDomainData(dataArray);

        // Calculate RMS amplitude
        const rms = Math.sqrt(
          dataArray.reduce(
            (sum, val) => sum + Math.pow((val - 128) / 128, 2),
            0,
          ) / dataArray.length,
        );

        const isSilent = rms < SILENCE_THRESHOLD;

        if (isSilent) {
          // Start silence timer if not already running
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              const chunkDuration = Date.now() - chunkStartTimeRef.current;

              if (
                chunkDuration >= MIN_CHUNK_MS &&
                mediaRecorderRef.current?.state === "recording"
              ) {
                // Stop current recorder — triggers ondataavailable
                mediaRecorderRef.current.stop();
              }
              silenceTimerRef.current = null;
            }, SILENCE_DURATION_MS);
          }
        } else {
          // Speaking — clear silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        }

        animationFrameRef.current = requestAnimationFrame(checkSilence);
      };

      checkSilence();
    },
    [],
  );

  // Start a new MediaRecorder segment
  const startNewSegment = useCallback(
    (stream: MediaStream, langCode: string) => {
      audioChunksRef.current = [];
      chunkStartTimeRef.current = Date.now();

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        sendAudioChunk(blob, langCode);

        // Restart a new segment if still recording
        if (isRecordingRef.current && streamRef.current) {
          startNewSegment(streamRef.current, langCode);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
    },
    [sendAudioChunk],
  );

  // Initialize microphone
  const initMicrophone = useCallback(
    async (langCode: string) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;
        startSilenceDetection(stream, langCode);
        startNewSegment(stream, langCode);
      } catch (err) {
        console.error("Microphone access denied:", err);
      }
    },
    [startSilenceDetection, startNewSegment],
  );

  // Cleanup microphone
  const stopMicrophone = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    if (mediaRecorderRef.current?.state === "recording")
      mediaRecorderRef.current.stop();
    if (audioContextRef.current) audioContextRef.current.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  // Start/stop recording based on isRecording state
  useEffect(() => {
    if (isRecording) {
      initMicrophone(selectedLanguage);
    } else {
      stopMicrophone();
    }
    return () => stopMicrophone();
  }, [isRecording]); // eslint-disable-line

  // Fetch consultation
  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/onsite-consultations/${consultationId}`,
          { headers: { Authorization: `Bearer ${token}` } },
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

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Waveform animation
  useEffect(() => {
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
    stopMicrophone();
    router.push(`/dashboard/doctor/direct-visit/soap-note/${consultationId}`);
  };

  const handlePause = () => setIsRecording((prev) => !prev);

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
        overflow: "hidden",
        border: "2px solid transparent",
        boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, bgcolor: COLORS.background.paper }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "40px",
          }}
        >
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

          <Box
            sx={{
              width: "1px",
              height: 60,
              background: "linear-gradient(90deg, #009BE8 0%, #00C9AB 100%)",
              borderRadius: 1,
            }}
          />

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

      {/* Waveform */}
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
        <Box
          sx={{ width: 400, bgcolor: "#F6FBFF", borderRadius: 3, py: 2, px: 3 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              sx={{
                color: isRecording ? COLORS.error.main : COLORS.text.muted,
                bgcolor: isRecording ? "#FFE5E5" : COLORS.background.subtle,
              }}
            >
              {isRecording ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
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

      {/* Live Transcription */}
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
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ar">Arabic</MenuItem>
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

        {transcriptExpanded && (
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              pr: 1,
              minHeight: 0,
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "rgba(0,0,0,0.05)",
                borderRadius: "10px",
              },
            }}
          >
            {transcriptMessages.length === 0 ? (
              <Typography
                variant="body2"
                color={COLORS.text.muted}
                sx={{ textAlign: "center", mt: 4 }}
              >
                {isRecording
                  ? "Listening... Start speaking to see transcription."
                  : "Recording paused."}
              </Typography>
            ) : (
              transcriptMessages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  content={msg.content}
                  time={msg.time}
                  isAi={msg.isAi}
                  sender={msg.sender}
                />
              ))
            )}
          </Box>
        )}
      </Box>

      {/* Actions */}
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
            "&:hover": { bgcolor: COLORS.error.main },
          }}
        >
          End Consultation
        </Button>
      </Box>
    </Paper>
  );
};

export default ConsultationInterface;
