class StreamAudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.frameSize = 1600; // 100ms @ 16kHz = 1600 samples
    this.buffer = [];
    this.frameCount = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      const channelData = input[0];

      for (let i = 0; i < channelData.length; i++) {
        this.buffer.push(channelData[i]);

        if (this.buffer.length >= this.frameSize) {
          const frame = new Float32Array(this.buffer.splice(0, this.frameSize));

          // Convert Float32 [-1, 1] to Int16 [-32768, 32767]
          const int16Frame = new Int16Array(frame.length);
          for (let j = 0; j < frame.length; j++) {
            const s = Math.max(-1, Math.min(1, frame[j]));
            int16Frame[j] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }

          this.frameCount++;

          if (this.frameCount % 100 === 0) {
            this.port.postMessage({
              audioData: int16Frame.buffer,
              debug: {
                frameCount: this.frameCount,
                bufferSize: int16Frame.buffer.byteLength,
              },
            }, [int16Frame.buffer]);
          } else {
            this.port.postMessage({ audioData: int16Frame.buffer }, [int16Frame.buffer]);
          }
        }
      }
    }

    return true;
  }
}

registerProcessor('stream-audio-processor', StreamAudioProcessor);
