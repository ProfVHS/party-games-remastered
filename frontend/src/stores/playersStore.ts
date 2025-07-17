import { create } from 'zustand';
import { PlayerType } from '../types';
import { socket } from '../socket';

interface PlayersStoreProps {
  players: PlayerType[];
  setPlayers: (data: PlayerType[]) => void;
  fetchPlayers: () => void;
}

export const usePlayersStore = create<PlayersStoreProps>((set) => ({
  players: [],
  setPlayers: (data: PlayerType[]) => {
    set({ players: data });
  },
  fetchPlayers: () => {
    console.time('fetchPlayers');
    socket.emit('get_players');

    socket.on('set_players', (data: PlayerType[]) => {
      set({ players: data });
      console.timeEnd('fetchPlayers');
    });
  },
}));
