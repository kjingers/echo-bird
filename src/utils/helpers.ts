import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format duration in milliseconds to mm:ss
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Convert ArrayBuffer to Blob URL for audio playback
 */
export function createAudioUrl(audioData: ArrayBuffer): string {
  const blob = new Blob([audioData], { type: 'audio/mp3' });
  return URL.createObjectURL(blob);
}

/**
 * Download audio data as MP3 file
 */
export function downloadAudio(audioData: ArrayBuffer, filename: string = 'speech.mp3'): void {
  const blob = new Blob([audioData], { type: 'audio/mp3' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get style display name from style key
 */
export function getStyleDisplayName(style: string): string {
  const styleNames: Record<string, string> = {
    'default': 'Default',
    'cheerful': 'Cheerful',
    'sad': 'Sad',
    'angry': 'Angry',
    'fearful': 'Fearful',
    'disgruntled': 'Disgruntled',
    'serious': 'Serious',
    'depressed': 'Depressed',
    'embarrassed': 'Embarrassed',
    'affectionate': 'Affectionate',
    'gentle': 'Gentle',
    'calm': 'Calm',
    'envious': 'Envious',
    'hopeful': 'Hopeful',
    'lyrical': 'Lyrical',
    'terrified': 'Terrified',
    'shouting': 'Shouting',
    'unfriendly': 'Unfriendly',
    'whispering': 'Whispering',
    'excited': 'Excited',
    'friendly': 'Friendly',
    'assistant': 'Assistant',
    'newscast': 'Newscast',
    'customerservice': 'Customer Service',
    'chat': 'Casual Chat',
    'newscast-casual': 'Newscast Casual',
    'newscast-formal': 'Newscast Formal',
    'narration-professional': 'Professional Narration',
    'documentary-narration': 'Documentary Narration',
    'sports-commentary': 'Sports Commentary',
    'sports-commentary-excited': 'Sports Excited',
    'poetry-reading': 'Poetry Reading',
    'advertisement-upbeat': 'Advertisement',
  };
  
  return styleNames[style] || style.charAt(0).toUpperCase() + style.slice(1).replace(/-/g, ' ');
}

/**
 * Truncate text for display
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
