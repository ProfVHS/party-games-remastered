import { useEffect, Dispatch, SetStateAction } from 'react';
import { socket } from '../socket';

type useRoomToggleProps = {
  setPlayersReady: Dispatch<SetStateAction<number>>;
};

export const useRoomFetch = ({ setPlayersReady }: useRoomToggleProps) => {
  useEffect(() => {
    socket.on('fetch_ready_players', (playersReadyCount: number) => {
      setPlayersReady(playersReadyCount);
    });

    return () => {
      socket.off('fetch_ready_players');
    };
  }, []);
};
