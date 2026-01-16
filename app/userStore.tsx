import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  PLAYER_NAME: 'playerName',
  TOTAL_COINS: 'bible_game_total_coins',
  STAGE1_PROGRESS: 'bible_stage1_progress',
};

interface Stage1Progress {
  currentLevel: number;
  revealedBooks: Record<string, boolean>;
  bounceCount: Record<string, number>;
  levelCompletionStatus: Record<number, boolean>;
}

interface GameState {
  // Player Info
  playerName: string;
  setPlayerName: (name: string) => void;
  
  // Coins/Points
  totalCoins: number;
  addCoins: (amount: number) => void;
  setCoins: (amount: number) => void;
  
  // Stage 1 Progress
  stage1Progress: Stage1Progress;
  setStage1Progress: (progress: Partial<Stage1Progress>) => void;
  resetStage1Progress: () => void;
  
  // Initialization and Persistence
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  resetAllProgress: () => Promise<void>;
}

const defaultStage1Progress: Stage1Progress = {
  currentLevel: 0,
  revealedBooks: {},
  bounceCount: {},
  levelCompletionStatus: {},
};

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  playerName: 'Guest',
  totalCoins: 0,
  stage1Progress: defaultStage1Progress,

  // Player name actions
  setPlayerName: (name: string) => {
    set({ playerName: name });
    AsyncStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name);
  },

  // Coins actions
  addCoins: (amount: number) => {
    const newTotal = get().totalCoins + amount;
    set({ totalCoins: newTotal });
    AsyncStorage.setItem(STORAGE_KEYS.TOTAL_COINS, newTotal.toString());
  },

  setCoins: (amount: number) => {
    set({ totalCoins: amount });
    AsyncStorage.setItem(STORAGE_KEYS.TOTAL_COINS, amount.toString());
  },

  // Stage 1 progress actions
  setStage1Progress: (progress: Partial<Stage1Progress>) => {
    const currentProgress = get().stage1Progress;
    const newProgress = { ...currentProgress, ...progress };
    set({ stage1Progress: newProgress });
    AsyncStorage.setItem(STORAGE_KEYS.STAGE1_PROGRESS, JSON.stringify(newProgress));
  },

  resetStage1Progress: () => {
    set({ stage1Progress: defaultStage1Progress });
    AsyncStorage.setItem(STORAGE_KEYS.STAGE1_PROGRESS, JSON.stringify(defaultStage1Progress));
  },

  // Load all data from storage
  loadFromStorage: async () => {
    try {
      const [savedName, savedCoins, savedStage1] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PLAYER_NAME),
        AsyncStorage.getItem(STORAGE_KEYS.TOTAL_COINS),
        AsyncStorage.getItem(STORAGE_KEYS.STAGE1_PROGRESS),
      ]);

      const updates: Partial<GameState> = {};

      if (savedName) {
        updates.playerName = savedName;
      }
      if (savedCoins) {
        updates.totalCoins = parseInt(savedCoins);
      }
      if (savedStage1) {
        updates.stage1Progress = JSON.parse(savedStage1);
      }

      set(updates);
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  },

  // Save all data to storage
  saveToStorage: async () => {
    try {
      const state = get();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.PLAYER_NAME, state.playerName),
        AsyncStorage.setItem(STORAGE_KEYS.TOTAL_COINS, state.totalCoins.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.STAGE1_PROGRESS, JSON.stringify(state.stage1Progress)),
      ]);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },

  // Reset everything
  resetAllProgress: async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TOTAL_COINS,
        STORAGE_KEYS.STAGE1_PROGRESS,
      ]);
      set({
        totalCoins: 0,
        stage1Progress: defaultStage1Progress,
      });
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  },
}));