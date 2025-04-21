import { create } from 'zustand';
import { PlayerType } from '../types';
import { socket } from '../socket';

interface PlayersStoreProps {
  players: PlayerType[];
  setPlayers: (data: PlayerType[]) => void;
  fetchPlayers: (roomCode: string) => void;
}

export const usePlayersStore = create<PlayersStoreProps>((set) => ({
  players: [],
  setPlayers: (data: PlayerType[]) => {
    set({ players: data });
  },
  fetchPlayers: (roomCode: string) => {
    socket.emit('get_players', roomCode);

    socket.on('set_players', (data: PlayerType[]) => {
      set({ players: data });
    });
  },
}));
