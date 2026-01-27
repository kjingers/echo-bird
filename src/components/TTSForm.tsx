import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mic2, Wand2 } from 'lucide-react';
import { useVoices, useSpeechSynthesis } from '@/hooks';
import { getStyleDisplayName } from '@/utils';
import type { VoiceCategory } from '@/types';
import { Button } from './Button';
import { TextArea } from './TextArea';
import { Select } from './Select';
import { AudioPlayer } from './AudioPlayer';
import { ErrorDisplay } from './ErrorDisplay';
import { VoiceSkeleton } from './LoadingSpinner';

const MAX_CHARS = 5000;

const SAMPLE_TEXTS = [
  "Welcome to Echo Bird! I'm your friendly text-to-speech assistant. Try selecting different voices and styles to hear how I can transform your words into natural-sounding speech.",
  "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the alphabet, making it perfect for testing voice clarity.",
  "Breaking news: Scientists have discovered a new species of singing bird in the Amazon rainforest. The bird's melodious call has captivated researchers worldwide.",
  "Once upon a time, in a land far, far away, there lived a curious little robot who dreamed of becoming a poet. Every night, under the starlit sky, it would compose verses about the beauty of the digital world.",
];

const VOICE_TYPE_OPTIONS = [
  { value: 'Neural', label: 'Neural' },
  { value: 'NeuralHD', label: 'Neural HD' },
  { value: 'Multilingual', label: 'Multilingual' },
];

export function TTSForm() {
  const [text, setText] = useState('');
  const [selectedVoiceType, setSelectedVoiceType] = useState<VoiceCategory>('Neural');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('default');
  
  const { data: voices, isLoading: voicesLoading, error: voicesError, refetch } = useVoices();
  const { synthesize, audioUrl, status, error: synthesisError, download, reset } = useSpeechSynthesis();

  // Filter voices by selected voice type
  const filteredVoices = useMemo(() => {
    if (!voices) return [];
    return voices.filter(v => v.category === selectedVoiceType);
  }, [voices, selectedVoiceType]);

  // Get available styles for selected voice
  const availableStyles = useMemo(() => {
    if (!filteredVoices || !selectedVoice) return [];
    const voice = filteredVoices.find(v => v.shortName === selectedVoice);
    return voice?.styleList || [];
  }, [filteredVoices, selectedVoice]);

  // Voice options for select (filtered by voice type)
  const voiceOptions = useMemo(() => {
    return filteredVoices.map(v => ({
      value: v.shortName,
      label: `${v.displayName} (${v.gender})`,
    }));
  }, [filteredVoices]);

  // Style options for select
  const styleOptions = useMemo(() => {
    const options = [{ value: 'default', label: 'Default' }];
    availableStyles.forEach(style => {
      options.push({
        value: style,
        label: getStyleDisplayName(style),
      });
    });
    return options;
  }, [availableStyles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !selectedVoice) return;

    await synthesize({
      text: text.trim(),
      voiceName: selectedVoice,
      style: selectedStyle !== 'default' ? selectedStyle : undefined,
    });
  };

  const handleUseSample = () => {
    const randomSample = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setText(randomSample);
  };

  const handleVoiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoiceType(e.target.value as VoiceCategory);
    // Reset voice and style when voice type changes
    setSelectedVoice('');
    setSelectedStyle('default');
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(e.target.value);
    setSelectedStyle('default');
  };

  const isFormValid = text.trim().length > 0 && selectedVoice && text.length <= MAX_CHARS;
  const isLoading = status === 'loading';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-8"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Input */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Your Text</h2>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleUseSample}
            >
              <Wand2 className="w-4 h-4" />
              Use Sample
            </Button>
          </div>
          
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here... I'll transform it into natural-sounding speech!"
            rows={6}
            maxLength={MAX_CHARS}
            charCount={text.length}
            maxChars={MAX_CHARS}
            error={text.length > MAX_CHARS ? 'Text exceeds maximum length' : undefined}
          />
        </div>

        {/* Voice & Style Selection */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Voice Settings</h2>
          </div>

          {voicesLoading ? (
            <VoiceSkeleton />
          ) : voicesError ? (
            <ErrorDisplay 
              message={voicesError.message} 
              onRetry={() => refetch()} 
            />
          ) : (
            <div className="space-y-4">
              {/* Voice Type Selection */}
              <Select
                label="Voice Type"
                options={VOICE_TYPE_OPTIONS}
                value={selectedVoiceType}
                onChange={handleVoiceTypeChange}
              />
              
              {/* Voice Actor and Expression Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Voice Actor"
                  options={voiceOptions}
                  value={selectedVoice}
                  onChange={handleVoiceChange}
                  placeholder="Select a voice..."
                />
                
                {/* Only show Expression dropdown if voice has styles */}
                {selectedVoice && availableStyles.length > 0 && (
                  <Select
                    label="Expression Style"
                    options={styleOptions}
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                  />
                )}
              </div>
              
              {voiceOptions.length === 0 && (
                <p className="text-sm text-white/40">
                  No voices available for this type. Try selecting a different voice type.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!isFormValid || voicesLoading}
          isLoading={isLoading}
        >
          {isLoading ? 'Generating Speech...' : 'Convert to Speech'}
          {!isLoading && <Sparkles className="w-5 h-5" />}
        </Button>
      </form>

      {/* Error Display */}
      <AnimatePresence>
        {synthesisError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ErrorDisplay message={synthesisError} onRetry={reset} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Player */}
      <AnimatePresence>
        {audioUrl && status === 'success' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AudioPlayer
              src={audioUrl}
              onDownload={() => download('echo-bird-speech.mp3')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
