export type VoiceCategory = 'Neural' | 'NeuralHD' | 'Multilingual';

export interface Voice {
  name: string;
  displayName: string;
  shortName: string;
  locale: string;
  localeName: string;
  gender: 'Male' | 'Female';
  styleList?: string[];
  voiceType: string;
  category: VoiceCategory;
}

export interface VoiceStyle {
  name: string;
  displayName: string;
}

export interface SynthesisResult {
  audioData: ArrayBuffer;
  audioDuration: number;
}

export interface SynthesisOptions {
  text: string;
  voiceName: string;
  style?: string;
  styleDegree?: number;
  pitch?: string;
  rate?: string;
}

export interface SpeechConfig {
  subscriptionKey: string;
  region: string;
}

export type SynthesisStatus = 'idle' | 'loading' | 'success' | 'error';
