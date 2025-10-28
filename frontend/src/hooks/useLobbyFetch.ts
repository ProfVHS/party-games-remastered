import { Dispatch, SetStateAction, useEffect } from 'react';
import { socket } from '@socket';

type useLobbyFetchProps = {
  setPlayerIdsReady: Dispatch<SetStateAction<string[]>>;
};

export const useLobbyFetch = ({ setPlayerIdsReady }: useLobbyFetchProps) => {
  useEffect(() => {
    socket.emit('fetch_ready_players');

    socket.on('fetched_ready_players', (playersReadyCount: string[]) => {
      setPlayerIdsReady(playersReadyCount);
    });

    return () => {
      socket.off('fetched_ready_players');
    };
  }, []);
};
