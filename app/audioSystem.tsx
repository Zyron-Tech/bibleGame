import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

// 1. Sound effect types
export enum SoundEffect {
  BUTTON_PRESS = 'button_press',
  BOOK_REVEAL = 'book_reveal',
  LEVEL_COMPLETE = 'level_complete',
  COIN_EARNED = 'coin_earned',
  BOUNCE = 'bounce',
  SUCCESS = 'success',
  WHOOSH = 'whoosh',
}

// 2. Asset Mapping
const SOUND_ASSETS: Record<string, any> = {
  [SoundEffect.BUTTON_PRESS]: require('../assets/images/sounds/click.wav'),
  [SoundEffect.BOOK_REVEAL]: require('../assets/images/sounds/click.wav'),
  [SoundEffect.LEVEL_COMPLETE]: require('../assets/images/sounds/click.wav'),
  [SoundEffect.COIN_EARNED]: require('../assets/images/sounds/click.wav'),
  [SoundEffect.BOUNCE]: require('../assets/images/sounds/click.wav'),
  [SoundEffect.SUCCESS]: require('../assets/images/sounds/click.wav'),
  [SoundEffect.WHOOSH]: require('../assets/images/sounds/click.wav'),
  'BACKGROUND_MUSIC': require('../assets/images/sounds/game.mp3'),
};

class AudioManager {
  private backgroundMusic: Audio.Sound | null = null;
  private isMuted: boolean = false;
  private isSpeechEnabled: boolean = true;

  constructor() {
    this.initializeAudio();
  }

  async initializeAudio() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  // --- Helper to convert "1 Kings" to "First Kings" ---
  private formatBookNameForSpeech(name: string): string {
    // This regex looks for 1, 2, or 3 at the very beginning of the string
    return name
      .replace(/^1\s+/, 'First ')
      .replace(/^2\s+/, 'Second ')
      .replace(/^3\s+/, 'Third ');
  }

  // Play short sound effects
  async playSound(effect: SoundEffect) {
    if (this.isMuted) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        SOUND_ASSETS[effect],
        { shouldPlay: true }
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.warn(`Could not play sound: ${effect}`, error);
    }
  }

  // --- Background Music Methods ---
  
  async playBackgroundMusic() {
    try {
      if (this.backgroundMusic) return;

      const { sound } = await Audio.Sound.createAsync(
        SOUND_ASSETS['BACKGROUND_MUSIC'],
        { 
          shouldPlay: true, 
          isLooping: true, 
          volume: 0.30,
        }
      );

      this.backgroundMusic = sound;

      if (this.isMuted) {
        await this.backgroundMusic.pauseAsync();
      }
    } catch (error) {
      console.error("Error playing background music:", error);
    }
  }

  async stopBackgroundMusic() {
    if (this.backgroundMusic) {
      try {
        await this.backgroundMusic.stopAsync();
        await this.backgroundMusic.unloadAsync();
        this.backgroundMusic = null;
      } catch (error) {
        console.error("Error stopping music:", error);
      }
    }
  }

  // --- Text-to-Speech Methods ---

  async speakBookName(bookName: string, bookNumber: number) {
    if (!this.isSpeechEnabled) return;

    // Convert "1 Kings" -> "First Kings" before creating the sentence
    const formattedName = this.formatBookNameForSpeech(bookName);
    const text = `This is the book of ${formattedName}. Book number ${bookNumber}.`;
    
    try {
      await Speech.stop();
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.7,
        rate: 0.8,
        onDone: () => console.log('Finished speaking'),
        onError: (error) => console.error('Speech error:', error),
      });
    } catch (error) {
      console.error('Error speaking:', error);
    }
  }

  async speakText(text: string, options?: { pitch?: number; rate?: number }) {
    if (!this.isSpeechEnabled) return;

    try {
      await Speech.stop();
      await Speech.speak(text, {
        language: 'en-US',
        pitch: options?.pitch || 1.0,
        rate: options?.rate || 1.0,
      });
    } catch (error) {
      console.error('Error speaking:', error);
    }
  }

  async stopSpeech() {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }

  // --- Control Methods ---

  async setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.backgroundMusic) {
      if (muted) {
        await this.backgroundMusic.pauseAsync();
      } else {
        await this.backgroundMusic.playAsync();
      }
    }
  }

  setSpeechEnabled(enabled: boolean) {
    this.isSpeechEnabled = enabled;
    if (!enabled) {
      this.stopSpeech();
    }
  }

  isSoundMuted(): boolean {
    return this.isMuted;
  }

  isSpeechActive(): boolean {
    return this.isSpeechEnabled;
  }

  async checkSpeechAvailability(): Promise<boolean> {
    try {
      await Speech.isSpeakingAsync();
      return true;
    } catch (error) {
      console.error('Speech not available:', error);
      return false;
    }
  }
}

// Create singleton instance
export const audioManager = new AudioManager();

// Convenience functions
export const playSound = (effect: SoundEffect) => audioManager.playSound(effect);
export const playBackgroundMusic = () => audioManager.playBackgroundMusic();
export const stopBackgroundMusic = () => audioManager.stopBackgroundMusic();
export const speakBookName = (bookName: string, bookNumber: number) => 
  audioManager.speakBookName(bookName, bookNumber);
export const speakText = (text: string, options?: any) => 
  audioManager.speakText(text, options);
export const stopSpeech = () => audioManager.stopSpeech();
export const setMuted = (muted: boolean) => audioManager.setMuted(muted);
export const setSpeechEnabled = (enabled: boolean) => audioManager.setSpeechEnabled(enabled);