import { useEffect, Dispatch, SetStateAction } from 'react';
import { socket } from '../socket';

type useRoomToggleProps = {
  setPlayersReady: Dispatch<SetStateAction<number>>;
};

export const useRoomFetch = ({ setPlayersReady }: useRoomToggleProps) => {
  useEffect(() => {
    socket.on('joined_room', (playersReadyCount: number) => {
      setPlayersReady(playersReadyCount);
    });

    return () => {
      socket.off('joined_room');
    };
  }, []);
};
