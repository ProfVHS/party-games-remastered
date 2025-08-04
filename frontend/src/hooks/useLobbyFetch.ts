import { useEffect, Dispatch, SetStateAction } from 'react';
import { socket } from '../socket';

type useLobbyFetchProps = {
  setPlayersReady: Dispatch<SetStateAction<number>>;
};

export const useLobbyFetch = ({ setPlayersReady }: useLobbyFetchProps) => {
  useEffect(() => {
    socket.emit('fetch_ready_players');

    socket.on('fetched_ready_players', (playersReadyCount: number) => {
      setPlayersReady(playersReadyCount);
    });

    return () => {
      socket.off('fetched_ready_players');
    };
  }, []);
};
