import { useState, useCallback, useRef } from 'react';
import { speechService } from '@/services';
import { createAudioUrl, downloadAudio } from '@/utils';
import type { SynthesisOptions, SynthesisStatus } from '@/types';

interface UseSpeechSynthesisReturn {
  synthesize: (options: SynthesisOptions) => Promise<void>;
  audioUrl: string | null;
  audioData: ArrayBuffer | null;
  status: SynthesisStatus;
  error: string | null;
  duration: number;
  download: (filename?: string) => void;
  reset: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<ArrayBuffer | null>(null);
  const [status, setStatus] = useState<SynthesisStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  
  const prevUrlRef = useRef<string | null>(null);

  const synthesize = useCallback(async (options: SynthesisOptions) => {
    // Revoke previous URL to prevent memory leaks
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }

    setStatus('loading');
    setError(null);
    setAudioUrl(null);
    setAudioData(null);

    try {
      const result = await speechService.synthesize(options);
      const url = createAudioUrl(result.audioData);
      
      prevUrlRef.current = url;
      setAudioUrl(url);
      setAudioData(result.audioData);
      setDuration(result.audioDuration);
      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Synthesis failed';
      setError(message);
      setStatus('error');
    }
  }, []);

  const download = useCallback((filename?: string) => {
    if (audioData) {
      downloadAudio(audioData, filename);
    }
  }, [audioData]);

  const reset = useCallback(() => {
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
    setAudioUrl(null);
    setAudioData(null);
    setStatus('idle');
    setError(null);
    setDuration(0);
  }, []);

  return {
    synthesize,
    audioUrl,
    audioData,
    status,
    error,
    duration,
    download,
    reset,
  };
}
