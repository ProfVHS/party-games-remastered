import { useEffect, Dispatch, SetStateAction } from 'react';
import { socket } from '../socket';

type useLobbyFetchProps = {
  setPlayersReady: Dispatch<SetStateAction<number>>;
};

export const useLobbyFetch = ({ setPlayersReady }: useLobbyFetchProps) => {
  useEffect(() => {
    socket.on('fetch_ready_players', (playersReadyCount: number) => {
      setPlayersReady(playersReadyCount);
    });

    return () => {
      socket.off('fetch_ready_players');
    };
  }, []);
};
