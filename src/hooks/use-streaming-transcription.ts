import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

// If the same speaker sends another transcript within this time, append to existing bubble
const SAME_BUBBLE_THRESHOLD_MS = 5000; // 5 seconds

interface Transcript {
  id: string;
  speaker: 'doctor' | 'patient';
  content: string;
  isPartial: boolean;
  timestamp: string;
}

interface MicStream {
  stream: MediaStream | null;
  audioContext: AudioContext | null;
  workletNode: AudioWorkletNode | null;
  isStreaming: boolean;
}

export function useStreamingTranscription(consultationId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Track last transcript arrival time per speaker for bubble grouping
  const lastTranscriptTimeRef = useRef<Record<string, number>>({
    doctor: 0,
    patient: 0,
  });

  const doctorStreamRef = useRef<MicStream>({
    stream: null,
    audioContext: null,
    workletNode: null,
    isStreaming: false,
  });

  const patientStreamRef = useRef<MicStream>({
    stream: null,
    audioContext: null,
    workletNode: null,
    isStreaming: false,
  });

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = Cookies.get('accessToken');
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';
    const wsBaseUrl = API_BASE_URL.replace('/api/v1', '');

    socketRef.current = io(`${wsBaseUrl}/transcription`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      socketRef.current?.emit('join-consultation', { consultationId });
    });

    socketRef.current.on('joined', () => {
      setIsConnected(true);
    });

    socketRef.current.on('transcript', (data: any) => {
      if (!data.transcript || data.transcript.trim() === '') {
        return;
      }

      const now = Date.now();
      const lastTime = lastTranscriptTimeRef.current[data.speaker] || 0;
      const elapsed = now - lastTime;
      const shouldAppend = lastTime > 0 && elapsed <= SAME_BUBBLE_THRESHOLD_MS;

      lastTranscriptTimeRef.current[data.speaker] = now;

      setTranscripts((prev) => {
        if (data.isPartial) {
          const existingIdx = prev.findIndex(
            t => t.speaker === data.speaker && t.isPartial
          );
          if (existingIdx >= 0) {
            const updated = [...prev];
            updated[existingIdx] = {
              ...updated[existingIdx],
              content: data.transcript,
              timestamp: data.timestamp,
            };
            return updated;
          }
          return [
            ...prev,
            {
              id: crypto.randomUUID(),
              speaker: data.speaker,
              content: data.transcript,
              isPartial: true,
              timestamp: data.timestamp,
            },
          ];
        }

        // Final transcript — remove any partial for this speaker first
        const withoutPartial = prev.filter(
          t => !(t.speaker === data.speaker && t.isPartial)
        );

        if (shouldAppend) {
          // Find last bubble for this speaker and append
          const lastIdx = withoutPartial.reduce<number>(
            (found, t, i) => (t.speaker === data.speaker ? i : found),
            -1
          );
          if (lastIdx >= 0) {
            const updated = [...withoutPartial];
            updated[lastIdx] = {
              ...updated[lastIdx],
              content: `${updated[lastIdx].content} ${data.transcript}`.trim(),
              timestamp: data.timestamp,
            };
            return updated;
          }
        }

        // Pause > 5s or no previous bubble — new bubble
        return [
          ...withoutPartial,
          {
            id: crypto.randomUUID(),
            speaker: data.speaker,
            content: data.transcript,
            isPartial: false,
            timestamp: data.timestamp,
          },
        ];
      });
    });

    socketRef.current.on('transcript-error', (err: any) => {
      setError(err.message || 'Transcription error');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('error', (err: any) => {
      setError(err.message || 'Connection error');
    });

    return () => {
      stopStream('doctor');
      stopStream('patient');
      socketRef.current?.emit('leave-consultation', { consultationId });
      socketRef.current?.disconnect();
    };
  }, [consultationId]);

  const startStream = useCallback(async (
    speaker: 'doctor' | 'patient',
    deviceId: string,
    languageCode: string
  ) => {
    const streamRef = speaker === 'doctor' ? doctorStreamRef : patientStreamRef;

    if (streamRef.current.isStreaming) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: deviceId },
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const audioContext = new AudioContext({ sampleRate: 16000 });
      await audioContext.audioWorklet.addModule('/audio-processor.worklet.js');

      const source = audioContext.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(audioContext, 'stream-audio-processor');

      workletNode.port.onmessage = (event) => {
        if (socketRef.current?.connected) {
          socketRef.current.emit('audio-frame', {
            consultationId,
            speaker,
            audioData: event.data.audioData,
          });
        }
      };

      source.connect(workletNode);

      streamRef.current = {
        stream,
        audioContext,
        workletNode,
        isStreaming: true,
      };

      socketRef.current?.emit('start-stream', {
        consultationId,
        speaker,
        languageCode,
        sampleRate: 16000,
      });

    } catch (err) {
      setError(`Microphone access denied for ${speaker}`);
    }
  }, [consultationId]);

  const stopStream = useCallback((speaker: 'doctor' | 'patient') => {
    const streamRef = speaker === 'doctor' ? doctorStreamRef : patientStreamRef;

    if (!streamRef.current.isStreaming) {
      return;
    }

    streamRef.current.workletNode?.disconnect();
    streamRef.current.audioContext?.close();
    streamRef.current.stream?.getTracks().forEach(track => track.stop());

    streamRef.current = {
      stream: null,
      audioContext: null,
      workletNode: null,
      isStreaming: false,
    };

    socketRef.current?.emit('stop-stream', { consultationId, speaker });

    // Reset bubble timer so next session starts fresh
    lastTranscriptTimeRef.current[speaker] = 0;
  }, [consultationId]);

  return {
    isConnected,
    transcripts,
    error,
    startStream,
    stopStream,
    isDoctorStreaming: doctorStreamRef.current.isStreaming,
    isPatientStreaming: patientStreamRef.current.isStreaming,
  };
}
