import { create } from 'zustand';

export const useGameStore = create((set) => ({
  playerName: 'Guest',
  setPlayerName: (name:string) => set({ playerName: name }),
}));


