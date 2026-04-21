import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import type { Voice, VoiceCategory, SynthesisOptions, SynthesisResult } from '@/types';

const SPEECH_KEY = import.meta.env.VITE_AZURE_SPEECH_KEY || '';
const SPEECH_REGION = import.meta.env.VITE_AZURE_SPEECH_REGION || 'eastus';

// Keep each synthesis request short to avoid WebSocket timeouts on long texts
const CHUNK_SIZE = 3000;

function splitTextIntoChunks(text: string, maxChunkSize: number = CHUNK_SIZE): string[] {
  if (text.length <= maxChunkSize) return [text];

  const chunks: string[] = [];
  let remaining = text.trim();

  while (remaining.length > 0) {
    if (remaining.length <= maxChunkSize) {
      chunks.push(remaining);
      break;
    }

    const slice = remaining.slice(0, maxChunkSize);

    // Prefer splitting after sentence-ending punctuation
    const sentenceMatch = slice.match(/^[\s\S]*[.!?](?=\s|$)/);
    let splitIdx = sentenceMatch ? sentenceMatch[0].length : -1;

    // Fall back to last newline
    if (splitIdx < 0) {
      const newlineIdx = slice.lastIndexOf('\n');
      if (newlineIdx > 0) splitIdx = newlineIdx + 1;
    }

    // Fall back to last space
    if (splitIdx < 0) {
      const spaceIdx = slice.lastIndexOf(' ');
      if (spaceIdx > 0) splitIdx = spaceIdx + 1;
    }

    // Hard cut if no boundary found
    if (splitIdx <= 0) splitIdx = maxChunkSize;

    chunks.push(remaining.slice(0, splitIdx).trim());
    remaining = remaining.slice(splitIdx).trim();
  }

  return chunks.filter(c => c.length > 0);
}

function concatenateArrayBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
  const totalLength = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of buffers) {
    result.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }
  return result.buffer;
}

/**
 * Determines the voice category based on voice name patterns and style support
 * @param voiceName - The full voice name (e.g., "en-US-JennyNeural")
 * @param isOnlineNeural - Whether the voice is an online neural voice
 * @param hasStyles - Whether the voice has style/expression support
 * @returns The voice category or null if the voice should be excluded
 */
export function getVoiceCategory(voiceName: string, isOnlineNeural: boolean, hasStyles: boolean): VoiceCategory | null {
  // Skip standard (non-neural) voices entirely
  if (!isOnlineNeural) {
    return null;
  }
  
  // Check for HD voices (DragonHD, Phoenix patterns or explicit HD suffix)
  if (voiceName.includes('DragonHD') || 
      voiceName.includes('HD') ||
      voiceName.includes('Phoenix')) {
    return 'NeuralHD';
  }
  
  // Check for multilingual voices
  if (voiceName.includes('Multilingual') || 
      voiceName.includes('MultilingualNeural')) {
    return 'Multilingual';
  }
  
  // Neural voices with expression/style support
  if (hasStyles) {
    return 'NeuralExpressive';
  }
  
  // Default neural voices (no expression support)
  return 'Neural';
}

/**
 * Azure Speech Service wrapper for Text-to-Speech operations
 */
export class SpeechService {
  private speechConfig: sdk.SpeechConfig | null = null;

  constructor() {
    if (SPEECH_KEY) {
      this.speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
      this.speechConfig.speechSynthesisOutputFormat = 
        sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;
    }
  }

  /**
   * Fetches available voices from Azure TTS API
   */
  async getVoices(): Promise<Voice[]> {
    if (!this.speechConfig) {
      throw new Error('Speech service not configured. Please set VITE_AZURE_SPEECH_KEY.');
    }

    const synthesizer = new sdk.SpeechSynthesizer(this.speechConfig);
    
    return new Promise((resolve, reject) => {
      synthesizer.getVoicesAsync().then(
        (result: sdk.SynthesisVoicesResult) => {
          synthesizer.close();
          if (result.errorDetails) {
            reject(new Error(result.errorDetails));
            return;
          }
          
          const voices: Voice[] = [];
          
          for (const v of result.voices) {
            const hasStyles = !!(v.styleList?.length && v.styleList.length > 0);
            const isOnlineNeural = v.voiceType === sdk.SynthesisVoiceType.OnlineNeural;
            const category = getVoiceCategory(v.name, isOnlineNeural, hasStyles);
            
            // Skip non-neural voices (Standard voices are excluded)
            if (category === null) continue;
            
            // Only include English voices for better demo experience
            if (!v.locale.startsWith('en-')) continue;
            
            voices.push({
              name: v.name,
              displayName: v.displayName,
              shortName: v.shortName,
              locale: v.locale,
              localeName: v.localeName,
              gender: v.gender === sdk.SynthesisVoiceGender.Male ? 'Male' : 'Female',
              styleList: v.styleList?.length ? v.styleList : undefined,
              voiceType: v.voiceType === sdk.SynthesisVoiceType.OnlineNeural 
                ? 'Neural' 
                : 'Standard',
              category,
            });
          }
          
          // Sort by display name
          voices.sort((a, b) => a.displayName.localeCompare(b.displayName));
          
          resolve(voices);
        },
        (error: string) => {
          synthesizer.close();
          reject(new Error(error));
        }
      );
    });
  }

  /**
   * Generates SSML for speech synthesis with optional style
   */
  private generateSSML(options: SynthesisOptions): string {
    const { text, voiceName, style, styleDegree = 1, pitch = 'default', rate = 'default' } = options;
    
    // Escape XML special characters
    const escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    if (style && style !== 'default') {
      return `
        <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" 
               xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
          <voice name="${voiceName}">
            <mstts:express-as style="${style}" styledegree="${styleDegree}">
              <prosody pitch="${pitch}" rate="${rate}">
                ${escapedText}
              </prosody>
            </mstts:express-as>
          </voice>
        </speak>
      `.trim();
    }

    return `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="${voiceName}">
          <prosody pitch="${pitch}" rate="${rate}">
            ${escapedText}
          </prosody>
        </voice>
      </speak>
    `.trim();
  }

  /**
   * Synthesizes a single SSML chunk, returns raw result
   */
  private synthesizeChunk(ssml: string): Promise<SynthesisResult> {
    return new Promise((resolve, reject) => {
      // null audio config prevents the SDK from auto-playing each chunk through the speaker
      const synthesizer = new sdk.SpeechSynthesizer(this.speechConfig!, null as unknown as sdk.AudioConfig);
      synthesizer.speakSsmlAsync(
        ssml,
        (result: sdk.SpeechSynthesisResult) => {
          synthesizer.close();
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            resolve({
              audioData: result.audioData,
              audioDuration: result.audioDuration / 10000,
            });
          } else if (result.reason === sdk.ResultReason.Canceled) {
            const cancellation = sdk.CancellationDetails.fromResult(result);
            reject(new Error(`Synthesis canceled: ${cancellation.errorDetails}`));
          } else {
            reject(new Error('Synthesis failed'));
          }
        },
        (error: string) => {
          synthesizer.close();
          reject(new Error(error));
        }
      );
    });
  }

  /**
   * Synthesizes speech from text, chunking automatically for long inputs to
   * avoid WebSocket timeouts. Calls onProgress(completedChunks, totalChunks)
   * after each chunk finishes.
   */
  async synthesize(
    options: SynthesisOptions,
    onProgress?: (completed: number, total: number) => void
  ): Promise<SynthesisResult> {
    if (!this.speechConfig) {
      throw new Error('Speech service not configured. Please set VITE_AZURE_SPEECH_KEY.');
    }

    const chunks = splitTextIntoChunks(options.text);
    const audioBuffers: ArrayBuffer[] = [];
    let totalDuration = 0;

    for (let i = 0; i < chunks.length; i++) {
      const ssml = this.generateSSML({ ...options, text: chunks[i] });
      const result = await this.synthesizeChunk(ssml);
      audioBuffers.push(result.audioData);
      totalDuration += result.audioDuration;
      onProgress?.(i + 1, chunks.length);
    }

    return {
      audioData: concatenateArrayBuffers(audioBuffers),
      audioDuration: totalDuration,
    };
  }

  /**
   * Checks if the service is properly configured
   */
  isConfigured(): boolean {
    return this.speechConfig !== null;
  }
}

// Singleton instance
export const speechService = new SpeechService();
