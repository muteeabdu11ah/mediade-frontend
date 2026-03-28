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
import { useGenerateSoapNote } from "@/hooks/use-soap-note";

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

const SILENCE_THRESHOLD = 0.015;
const SILENCE_DURATION_MS = 1000;
const MIN_CHUNK_MS = 1000;

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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chunkStartTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number | null>(null);
  const isRecordingRef = useRef(isRecording);
  const currentSpeakerRef = useRef<"doctor" | "patient">("doctor");
  const transcriptRef = useRef<TranscriptMessage[]>([]);

  const { mutate: transcribe } = useTranscribe();
  const { mutate: generateSoapNote, isPending: isGenerating } =
    useGenerateSoapNote();

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);
  useEffect(() => {
    transcriptRef.current = transcriptMessages;
  }, [transcriptMessages]);

  const sendAudioChunk = useCallback(
    (audioBlob: Blob, langCode: string) => {
      const speaker = currentSpeakerRef.current;
      const formData = new FormData();
      formData.append("file", audioBlob, "chunk.webm");
      formData.append("chunk_id", crypto.randomUUID());
      formData.append("language_code", langCode);

      transcribe(formData, {
        onSuccess: (data) => {
          if (!data.transcript?.trim()) return;
          const isDoctor = speaker === "doctor";
          setTranscriptMessages((prev) => [
            ...prev,
            {
              id: data.chunk_id,
              content: data.transcript,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              isAi: isDoctor,
              sender: isDoctor ? "DR" : "P",
            },
          ]);
          currentSpeakerRef.current =
            speaker === "doctor" ? "patient" : "doctor";
        },
      });
    },
    [transcribe],
  );

  const startSilenceDetection = useCallback(
    (stream: MediaStream, langCode: string) => {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      audioContextRef.current = audioContext;

      const dataArray = new Uint8Array(analyser.fftSize);
      const loop = () => {
        if (!isRecordingRef.current) return;
        analyser.getByteTimeDomainData(dataArray);
        const rms = Math.sqrt(
          dataArray.reduce((s, v) => s + Math.pow((v - 128) / 128, 2), 0) /
            dataArray.length,
        );

        if (rms < SILENCE_THRESHOLD) {
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              const elapsed = Date.now() - chunkStartTimeRef.current;
              if (
                elapsed >= MIN_CHUNK_MS &&
                mediaRecorderRef.current?.state === "recording"
              ) {
                mediaRecorderRef.current.stop();
              }
              silenceTimerRef.current = null;
            }, SILENCE_DURATION_MS);
          }
        } else {
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        }
        animationFrameRef.current = requestAnimationFrame(loop);
      };
      loop();
    },
    [],
  );

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
        if (isRecordingRef.current && streamRef.current)
          startNewSegment(streamRef.current, langCode);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
    },
    [sendAudioChunk],
  );

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
        console.error("Mic denied:", err);
      }
    },
    [startSilenceDetection, startNewSegment],
  );

  const stopMicrophone = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    if (mediaRecorderRef.current?.state === "recording")
      mediaRecorderRef.current.stop();
    audioContextRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (isRecording) initMicrophone(selectedLanguage);
    else stopMicrophone();
    return () => stopMicrophone();
  }, [isRecording]); // eslint-disable-line

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/onsite-consultations/${consultationId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setConsultation(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [consultationId]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (isRecording)
      id = setInterval(() => setRecordingTime((p) => p + 1), 1000);
    return () => clearInterval(id);
  }, [isRecording]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (isRecording)
      id = setInterval(
        () =>
          setWaveformHeights(
            Array.from({ length: 50 }, () => Math.random() * 60 + 40),
          ),
        150,
      );
    return () => clearInterval(id);
  }, [isRecording]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handlePause = () => setIsRecording((p) => !p);

  const handleEndConsultation = () => {
    stopMicrophone();

    // ── Single plain string — just all transcript content joined with spaces ──
    const fullTranscript = transcriptRef.current
      .map((msg) => msg.content.trim())
      .filter(Boolean)
      .join(" ");

    // if (!fullTranscript.trim()) {
    //   router.push(`/dashboard/doctor/direct-visit/soap-note/${consultationId}`);
    //   return;
    // }
    console.log(fullTranscript);

    generateSoapNote(fullTranscript, {
      onSuccess: (data) => {
        console.log("data for soap", data);
        window.sessionStorage.setItem(
          `soap-note-${consultationId}`,
          JSON.stringify(data),
        );
        router.push(
          `/dashboard/doctor/direct-visit/soap-note/${consultationId}`,
        );
      },
      onError: () => {
        router.push(
          `/dashboard/doctor/direct-visit/soap-note/${consultationId}`,
        );
      },
    });
  };

  if (loading)
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
                .map((n: string) => n[0])
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
              {waveformHeights.map((h, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    minWidth: 2,
                    height: `${h}%`,
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
          disabled={isGenerating}
          sx={{
            borderRadius: BORDER_RADIUS.md,
            px: 3,
            py: 0.75,
            bgcolor: COLORS.error.main,
            color: "white",
            "&:hover": { bgcolor: COLORS.error.main },
            "&.Mui-disabled": {
              bgcolor: COLORS.error.main,
              opacity: 0.7,
              color: "white",
            },
          }}
        >
          {isGenerating ? "Generating..." : "End Consultation"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ConsultationInterface;
