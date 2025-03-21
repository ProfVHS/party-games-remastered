import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { useToast } from './useToast';
import { EPossibleMinigames, MinigameDataType } from '../types';

type useRoomStartProps = {
  playersReady: number;
};

export const useRoomStart = ({ playersReady }: useRoomStartProps) => {
  const toast = useToast();
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (playersReady === 8) {
      setCountdown(3);

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            const roomCode = sessionStorage.getItem('roomCode');
            if (roomCode) {
              // TODO: Minigame is hardcoded here, should be dynamic
              socket.emit('start_minigame', roomCode, EPossibleMinigames.clickTheBomb);
            }
            clearInterval(timer);
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    } else {
      setCountdown(null);
    }

    return () => clearInterval(timer);
  }, [playersReady]);

  useEffect(() => {
    socket.on('started_minigame', (minigameData: MinigameDataType) => {
      // TODO: Display Minigame / Navigate to minigame / Start minigame on client idk
      console.log(minigameData); // TODO: remove this later
    });

    socket.on('failed_to_start_minigame', () => {
      toast.error({ message: 'Failed to start the game', duration: 5 });
    });

    return () => {
      socket.off('started_minigame');
      socket.off('failed_to_start_minigame');
    };
  }, []);

  return { countdown };
};
