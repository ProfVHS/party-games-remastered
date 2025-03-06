import { useEffect, Dispatch, SetStateAction } from 'react';
import { socket } from '../socket';
import { SocketPayload } from '../types';

type useRoomToggleProps = {
  setPlayersReady: Dispatch<SetStateAction<number>>;
};

export const useRoomFetch = ({ setPlayersReady }: useRoomToggleProps) => {
  useEffect(() => {
    socket.on('joined_room', (playersReadyCount: SocketPayload) => {
      setPlayersReady(playersReadyCount as number);
    });

    return () => {
      socket.off('joined_room');
    };
  }, []);
};
