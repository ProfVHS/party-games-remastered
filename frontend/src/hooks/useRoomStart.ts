import { useEffect } from 'react';
import { socket } from '../socket';
import { useToast } from './useToast';

type useRoomStartProps = {
  playersReady: number;
};

export const useRoomStart = ({ playersReady }: useRoomStartProps) => {
  const toast = useToast();

  useEffect(() => {
    socket.on('started_minigame', (minigameData: Object) => {
      // TODO: Navigate to minigame | Start minigame on client
    });

    socket.on('failed_to_start_minigame', () => {
      toast.error({ message: 'Failed to start the game', duration: 5 });
    });

    return () => {
      socket.off('started_minigame');
    };
  }, [playersReady]);
};

const roomCode = sessionStorage.getItem('roomCode');
if (roomCode) {
  socket.emit('start_minigame', roomCode, 'Click the Bomb');
}
