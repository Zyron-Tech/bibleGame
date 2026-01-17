import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

export enum SoundEffect {
  BUTTON_PRESS = 'button_press',
  BOOK_REVEAL = 'book_reveal',
  LEVEL_COMPLETE = 'level_complete',
  COIN_EARNED = 'coin_earned',
  BOUNCE = 'bounce',
  SUCCESS = 'success',
  WHOOSH = 'whoosh',
}

const SOUND_ASSETS: Record<string, any> = {
  [SoundEffect.BUTTON_PRESS]: require('../assets/images/sounds/click.wav'),
  [SoundEffect.BOOK_REVEAL]: require('../assets/images/sounds/click.wav'),
  [SoundEffect.LEVEL_COMPLETE]: require('../assets/images/sounds/click.wav'),
  [SoundEffect.COIN_EARNED]: require('../assets/images/sounds/click.wav'),
  [SoundEffect.BOUNCE]: require('../assets/images/sounds/click.wav'),
  [SoundEffect.SUCCESS]: require('../assets/images/sounds/click.wav'),
  [SoundEffect.WHOOSH]: require('../assets/images/sounds/click.wav'),
};

class AudioManager {
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

  async speakBookName(bookName: string, bookNumber: number) {
    if (!this.isSpeechEnabled) return;
    const text = `This is the book of ${bookName}. Book number ${bookNumber}.`;
    try {
      await Speech.stop();
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.7,
        rate: 0.8,
      });
    } catch (error) {
      console.error('Error speaking:', error);
    }
  }

  async speakText(text: string, options?: {
    pitch?: number;
    rate?: number;
  }) {
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

  setMuted(muted: boolean) { 
    this.isMuted = muted; 
  }
  
  setSpeechEnabled(enabled: boolean) { 
    this.isSpeechEnabled = enabled; 
    if (!enabled) Speech.stop();
  }

  isSoundMuted(): boolean {
    return this.isMuted;
  }

  isSpeechActive(): boolean {
    return this.isSpeechEnabled;
  }
}

export const audioManager = new AudioManager();
export const playSound = (effect: SoundEffect) => audioManager.playSound(effect);
export const speakBookName = (bookName: string, bookNumber: number) => 
  audioManager.speakBookName(bookName, bookNumber);
export const speakText = (text: string, options?: any) => 
  audioManager.speakText(text, options);
export const stopSpeech = () => Speech.stop();
export const setMuted = (muted: boolean) => audioManager.setMuted(muted);
export const setSpeechEnabled = (enabled: boolean) => audioManager.setSpeechEnabled(enabled);