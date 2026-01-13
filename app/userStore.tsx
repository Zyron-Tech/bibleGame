import { create } from 'zustand';

export const useGameStore = create((set) => ({
  playerName: 'Guest', // This is your "Global Constant"
  setPlayerName: (name) => set({ playerName: name }),
}));