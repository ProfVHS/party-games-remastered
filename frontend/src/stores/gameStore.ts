import { create } from 'zustand';
import { socket } from '../socket';
import { MinigameDataType } from '../types';

interface MinigameStoreProps {
  minigameData: MinigameDataType | null;
  setMinigameData: (data: MinigameDataType) => void;
  fetchMinigameData: () => void;
}

export const useMinigameStore = create<MinigameStoreProps>((set) => ({
  minigameData: null,
  setMinigameData: (data: MinigameDataType) => {
    set({ minigameData: data });
  },
  fetchMinigameData: () => {
    socket.emit('get_game_data');

    socket.on('received_game_data', (data: MinigameDataType) => {
      set({ minigameData: data });
    });

    return () => {
      socket.off('set_game_data');
    };
  },
}));
