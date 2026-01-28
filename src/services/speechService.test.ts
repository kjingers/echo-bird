import { describe, it, expect } from 'vitest';
import { getVoiceCategory } from './speechService';

describe('getVoiceCategory', () => {
  describe('Non-neural voices', () => {
    it('returns null for standard (non-neural) voices', () => {
      expect(getVoiceCategory('en-US-Guy24kRUS', false, false)).toBeNull();
      expect(getVoiceCategory('en-US-AriaRUS', false, true)).toBeNull();
    });
  });

  describe('NeuralHD voices', () => {
    it('categorizes DragonHD voices as NeuralHD', () => {
      expect(getVoiceCategory('en-US-DragonHDNeural', true, false)).toBe('NeuralHD');
    });

    it('categorizes HD suffix voices as NeuralHD', () => {
      expect(getVoiceCategory('en-US-JennyHDNeural', true, false)).toBe('NeuralHD');
    });

    it('categorizes Phoenix voices as NeuralHD', () => {
      expect(getVoiceCategory('en-US-PhoenixNeural', true, false)).toBe('NeuralHD');
    });
  });

  describe('Multilingual voices', () => {
    it('categorizes Multilingual voices correctly', () => {
      expect(getVoiceCategory('en-US-JennyMultilingual', true, false)).toBe('Multilingual');
    });

    it('categorizes MultilingualNeural voices correctly', () => {
      expect(getVoiceCategory('en-US-AvaMultilingualNeural', true, false)).toBe('Multilingual');
    });
  });

  describe('NeuralExpressive voices', () => {
    it('categorizes neural voices with styles as NeuralExpressive', () => {
      expect(getVoiceCategory('en-US-JennyNeural', true, true)).toBe('NeuralExpressive');
      expect(getVoiceCategory('en-US-AriaNeural', true, true)).toBe('NeuralExpressive');
      expect(getVoiceCategory('en-US-GuyNeural', true, true)).toBe('NeuralExpressive');
      expect(getVoiceCategory('en-US-SaraNeural', true, true)).toBe('NeuralExpressive');
    });
  });

  describe('Neural (non-expressive) voices', () => {
    it('categorizes neural voices without styles as Neural', () => {
      expect(getVoiceCategory('en-US-ChristopherNeural', true, false)).toBe('Neural');
      expect(getVoiceCategory('en-US-EricNeural', true, false)).toBe('Neural');
      expect(getVoiceCategory('en-US-MichelleNeural', true, false)).toBe('Neural');
    });
  });

  describe('Category priority', () => {
    it('prioritizes HD over expressive styles', () => {
      // Even if an HD voice has styles, it should be categorized as NeuralHD
      expect(getVoiceCategory('en-US-DragonHDNeural', true, true)).toBe('NeuralHD');
    });

    it('prioritizes Multilingual over expressive styles', () => {
      // Even if a multilingual voice has styles, it should be categorized as Multilingual
      expect(getVoiceCategory('en-US-JennyMultilingual', true, true)).toBe('Multilingual');
    });
  });
});
