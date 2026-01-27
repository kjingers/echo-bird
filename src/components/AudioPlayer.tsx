import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Download, Volume2 } from 'lucide-react';
import { Button } from './Button';
import { cn, formatDuration } from '@/utils';

// Deterministic waveform bar heights (stable across renders)
const WAVEFORM_HEIGHTS = [
  31, 38, 25, 52, 39, 26, 43, 30, 47, 34,
  21, 48, 35, 22, 49, 36, 23, 50, 37, 24,
  41, 28, 45, 32, 19, 46, 33, 20, 47, 34,
  21, 48, 35, 22, 49, 36, 23, 50, 37, 24,
];

interface AudioPlayerProps {
  src: string;
  onDownload?: () => void;
  className?: string;
}

export function AudioPlayer({ src, onDownload, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime * 1000);
    const handleLoadedMetadata = () => setDuration(audio.duration * 1000);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value) / 1000;
    audio.currentTime = time;
    setCurrentTime(time * 1000);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const vol = Number(e.target.value);
    audio.volume = vol;
    setVolume(vol);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass rounded-2xl p-6 space-y-4',
        className
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Waveform visualization placeholder */}
      <div className="relative h-16 flex items-center justify-center gap-1 overflow-hidden">
        {WAVEFORM_HEIGHTS.map((height, i) => (
          <motion.div
            key={i}
            className="w-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full"
            animate={{
              height: isPlaying 
                ? [8, height, 8]
                : 8,
            }}
            transition={{
              duration: 0.5,
              repeat: isPlaying ? Infinity : 0,
              delay: i * 0.02,
            }}
            style={{ height: 8 }}
          />
        ))}
        
        {/* Progress overlay */}
        <div 
          className="absolute inset-0 bg-slate-900/60 transition-all duration-100"
          style={{ left: `${progress}%` }}
        />
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, rgb(6, 182, 212) 0%, rgb(168, 85, 247) ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-white/50">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={restart}
            aria-label="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            variant="primary"
            size="md"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div
                  key="pause"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Pause className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Play className="w-5 h-5 ml-0.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {/* Volume */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-white/50" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%)`,
              }}
            />
          </div>

          {/* Download */}
          {onDownload && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onDownload}
              aria-label="Download MP3"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
