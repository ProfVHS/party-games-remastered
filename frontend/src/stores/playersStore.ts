import { create } from 'zustand';
import { socket } from '@socket';
import { PlayerType } from '@shared/types';

interface PlayersStoreProps {
  currentPlayer: PlayerType | null;
  oldPlayers: PlayerType[];
  players: PlayerType[];
  setOldPlayers: (data: PlayerType[]) => void;
  setPlayers: (data: PlayerType[]) => void;
}

export const usePlayersStore = create<PlayersStoreProps>((set) => ({
  currentPlayer: null,
  oldPlayers: [],
  players: [],
  setOldPlayers: (data: PlayerType[]) => {
    set({ oldPlayers: data });
  },
  setPlayers: (data: PlayerType[]) => {
    const currentPlayerData = data.find((player) => player.id === socket.id);
    set({ players: data, currentPlayer: currentPlayerData });
  },
}));
