import { Dispatch, SetStateAction, useEffect } from 'react';
import { socket } from '../socket';

type useToggleReadyProps = {
  setPlayersReady: Dispatch<SetStateAction<number>>;
};

export const useToggleReady = ({ setPlayersReady }: useToggleReadyProps) => {
  useEffect(() => {
    socket.on('toggle_ready_server', (readyCount: number) => {
      setPlayersReady(readyCount);
    });

    return () => {
      socket.off('toggle_ready_server');
    };
  }, [socket]);
};
