import { Dispatch, SetStateAction, useEffect } from 'react';
import { socket } from '../socket';

type useFetchPlayersReadyProps = {
  setPlayersReady: Dispatch<SetStateAction<number>>;
};

export const useSyncReadyPlayers = ({ setPlayersReady }: useFetchPlayersReadyProps) => {
  useEffect(() => {
    socket.on('fetched_players_ready', (readyCount: number) => {
      setPlayersReady(readyCount);
    });

    socket.on('toggled_player_ready', (readyCount: number) => {
      setPlayersReady(readyCount);
    });

    return () => {
      socket.off('fetched_players_ready');
      socket.off('toggled_player_ready');
    };
  }, [socket]);
};
