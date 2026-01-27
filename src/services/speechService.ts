import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import type { Voice, VoiceCategory, SynthesisOptions, SynthesisResult } from '@/types';

const SPEECH_KEY = import.meta.env.VITE_AZURE_SPEECH_KEY || '';
const SPEECH_REGION = import.meta.env.VITE_AZURE_SPEECH_REGION || 'eastus';

/**
 * Determines the voice category based on voice name patterns
 */
function getVoiceCategory(voiceName: string, voiceType: sdk.SynthesisVoiceType): VoiceCategory | null {
  // Skip standard (non-neural) voices entirely
  if (voiceType !== sdk.SynthesisVoiceType.OnlineNeural) {
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
  
  // Default neural voices
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
            const category = getVoiceCategory(v.name, v.voiceType);
            
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
   * Synthesizes speech from text
   */
  async synthesize(options: SynthesisOptions): Promise<SynthesisResult> {
    if (!this.speechConfig) {
      throw new Error('Speech service not configured. Please set VITE_AZURE_SPEECH_KEY.');
    }

    const synthesizer = new sdk.SpeechSynthesizer(this.speechConfig);
    const ssml = this.generateSSML(options);

    return new Promise((resolve, reject) => {
      synthesizer.speakSsmlAsync(
        ssml,
        (result: sdk.SpeechSynthesisResult) => {
          synthesizer.close();
          
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            resolve({
              audioData: result.audioData,
              audioDuration: result.audioDuration / 10000, // Convert to ms
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
   * Checks if the service is properly configured
   */
  isConfigured(): boolean {
    return this.speechConfig !== null;
  }
}

// Singleton instance
export const speechService = new SpeechService();
