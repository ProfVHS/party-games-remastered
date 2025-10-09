import { create } from 'zustand';
import { socket } from '@socket';
import { PlayerType } from '@shared/types';

interface PlayersStoreProps {
  currentPlayer: PlayerType | null;
  players: PlayerType[];
  setPlayers: (data: PlayerType[]) => void;
  fetchPlayers: () => void;
}

export const usePlayersStore = create<PlayersStoreProps>((set) => ({
  currentPlayer: null,
  players: [],
  setPlayers: (data: PlayerType[]) => {
    set({ players: data });
  },
  fetchPlayers: () => {
    socket.emit('get_players');

    socket.on('got_players', (data: PlayerType[]) => {
      const currentPlayerData = data.find((player) => player.id === socket.id);
      set({ players: data, currentPlayer: currentPlayerData });
    });
  },
}));
