import { Dispatch, SetStateAction, useEffect } from 'react';
import { socket } from '../socket';

type useFetchPlayersReadyProps = {
  setPlayersReady: Dispatch<SetStateAction<number>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const useSyncReadyPlayers = ({ setPlayersReady, setIsLoading }: useFetchPlayersReadyProps) => {
  useEffect(() => {
    socket.on('fetched_players_ready', (readyCount: number) => {
      setPlayersReady(readyCount);
    });

    socket.on('toggled_player_ready', (readyCount: number) => {
      setPlayersReady(readyCount);
      setIsLoading(false);
    });

    return () => {
      socket.off('fetched_players_ready');
      socket.off('toggled_player_ready');
    };
  }, [socket]);
};
