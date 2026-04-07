"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Alert,
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
import { useGenerateSoapNote } from "@/hooks/use-soap-note";
import { useStreamingTranscription } from "@/hooks/use-streaming-transcription";

interface ConsultationInterfaceProps {
  consultationId: string;
}

const ConsultationInterface: React.FC<ConsultationInterfaceProps> = ({
  consultationId,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [transcriptExpanded, setTranscriptExpanded] = useState(true);
  const [consultation, setConsultation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [waveformHeights, setWaveformHeights] = useState<number[]>(
    Array.from({ length: 50 }, () => Math.random() * 60 + 40),
  );
  
  // Microphone selection state
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [doctorMicId, setDoctorMicId] = useState<string>('');
  const [patientMicId, setPatientMicId] = useState<string>('');
  const [showMicSetup, setShowMicSetup] = useState(true);

  // Use streaming transcription hook
  const {
    isConnected,
    transcripts,
    error: streamError,
    startStream,
    stopStream,
    isDoctorStreaming,
    isPatientStreaming,
  } = useStreamingTranscription(consultationId);

  const { mutate: generateSoapNote, isPending: isGenerating } =
    useGenerateSoapNote();

  // Load consultation data
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/onsite-consultations/${consultationId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setConsultation(data);
      } catch {
        // consultation fetch failed — UI will fall back to defaults
      } finally {
        setLoading(false);
      }
    })();
  }, [consultationId]);

  // Enumerate audio devices
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(deviceList => {
      const audioInputs = deviceList.filter(d => d.kind === 'audioinput');
      setDevices(audioInputs);
      if (audioInputs.length >= 2) {
        setDoctorMicId(audioInputs[0].deviceId);
        setPatientMicId(audioInputs[1].deviceId);
      } else if (audioInputs.length === 1) {
        setDoctorMicId(audioInputs[0].deviceId);
        setPatientMicId(audioInputs[0].deviceId);
      }
    });
  }, []);

  // Recording timer
  useEffect(() => {
    let id: NodeJS.Timeout;
    if (isRecording)
      id = setInterval(() => setRecordingTime((p) => p + 1), 1000);
    return () => clearInterval(id);
  }, [isRecording]);

  // Waveform animation
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

  const handleStartRecording = () => {
    if (!doctorMicId || !patientMicId) {
      alert('Please select both microphones');
      return;
    }

    if (devices.length < 2) {
      const confirmSingleMic = window.confirm(
        'Only one microphone detected. Do you want to proceed with a single microphone for both doctor and patient?'
      );
      if (!confirmSingleMic) return;
    }

    setShowMicSetup(false);
    startStream('doctor', doctorMicId, selectedLanguage);

    if (doctorMicId !== patientMicId) {
      startStream('patient', patientMicId, selectedLanguage);
    }

    setIsRecording(true);
  };

  const handlePauseResume = () => {
    if (isRecording) {
      stopStream('doctor');
      stopStream('patient');
      setIsRecording(false);
    } else {
      startStream('doctor', doctorMicId, selectedLanguage);
      if (doctorMicId !== patientMicId) {
        startStream('patient', patientMicId, selectedLanguage);
      }
      setIsRecording(true);
    }
  };

  const handleEndConsultation = () => {
    stopStream('doctor');
    stopStream('patient');
    setIsRecording(false);

    const finalTranscripts = transcripts.filter(t => !t.isPartial);
    const fullTranscript = finalTranscripts
      .map(t => `${t.speaker === 'doctor' ? 'Doctor' : 'Patient'}: ${t.content}`)
      .join('\n');

    if (!fullTranscript.trim()) {
      router.push(`/dashboard/doctor/direct-visit/soap-note/${consultationId}`);
      return;
    }

    generateSoapNote(fullTranscript, {
      onSuccess: (data) => {
        window.sessionStorage.setItem(
          `soap-note-${consultationId}`,
          JSON.stringify(data),
        );
        router.push(`/dashboard/doctor/direct-visit/soap-note/${consultationId}`);
      },
      onError: () => {
        router.push(`/dashboard/doctor/direct-visit/soap-note/${consultationId}`);
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
    <>
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

          {/* Connection status */}
          {!isConnected && isRecording && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Alert severity="warning" sx={{ maxWidth: 400 }}>
                Connecting to transcription service...
              </Alert>
            </Box>
          )}
          {streamError && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Alert severity="error" sx={{ maxWidth: 400 }}>
                {streamError}
              </Alert>
            </Box>
          )}
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
                disabled={isRecording}
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
              {transcripts.length === 0 ? (
                <Typography
                  variant="body2"
                  color={COLORS.text.muted}
                  sx={{ textAlign: "center", mt: 4 }}
                >
                  {isRecording
                    ? "Listening... Start speaking to see transcription."
                    : "Click 'Start Consultation' to begin recording."}
                </Typography>
              ) : (
                transcripts.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      opacity: msg.isPartial ? 0.6 : 1,
                      fontStyle: msg.isPartial ? 'italic' : 'normal',
                    }}
                  >
                    <ChatMessage
                      content={msg.content}
                      time={new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      isAi={msg.speaker === 'doctor'}
                      sender={msg.speaker === 'doctor' ? 'DR' : 'P'}
                    />
                  </Box>
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
          {!isRecording && !showMicSetup ? (
            <Button
              variant="outlined"
              size="small"
              startIcon={<MicIcon />}
              onClick={handlePauseResume}
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
              Resume
            </Button>
          ) : isRecording ? (
            <Button
              variant="outlined"
              size="small"
              startIcon={<PauseIcon />}
              onClick={handlePauseResume}
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
              Pause
            </Button>
          ) : null}
          <Button
            variant="contained"
            size="small"
            onClick={handleEndConsultation}
            disabled={isGenerating || showMicSetup}
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

      {/* Microphone Setup Dialog */}
      <Dialog 
        open={showMicSetup} 
        onClose={() => {}}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Microphones</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {devices.length === 0 ? (
              <Alert severity="warning">
                No microphones detected. Please connect microphones and refresh.
              </Alert>
            ) : devices.length === 1 ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                Only one microphone detected. It will be used for both doctor and patient.
              </Alert>
            ) : null}
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Doctor Microphone</InputLabel>
              <Select
                value={doctorMicId}
                onChange={(e) => setDoctorMicId(e.target.value)}
                label="Doctor Microphone"
              >
                {devices.map(device => (
                  <MenuItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {devices.length > 1 && (
              <FormControl fullWidth>
                <InputLabel>Patient Microphone</InputLabel>
                <Select
                  value={patientMicId}
                  onChange={(e) => setPatientMicId(e.target.value)}
                  label="Patient Microphone"
                >
                  {devices.map(device => (
                    <MenuItem key={device.deviceId} value={device.deviceId}>
                      {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleStartRecording}
            variant="contained"
            disabled={!doctorMicId || !patientMicId}
          >
            Start Consultation
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConsultationInterface;
