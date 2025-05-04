import { useEffect, Dispatch, SetStateAction } from 'react';
import { socket } from '../../socket';

type useLobbyToggleProps = {
  setPlayersReady: Dispatch<SetStateAction<number>>;
};

export const useLobbyFetch = ({ setPlayersReady }: useLobbyToggleProps) => {
  useEffect(() => {
    socket.on('fetch_ready_players', (playersReadyCount: number) => {
      setPlayersReady(playersReadyCount);
    });

    return () => {
      socket.off('fetch_ready_players');
    };
  }, []);
};
