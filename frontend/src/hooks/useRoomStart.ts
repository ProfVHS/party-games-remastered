import { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';
import { useToast } from './useToast';
import { EPossibleMinigames, MinigameDataType } from '../types';
import { usePlayersStore } from '../stores/playersStore';

type useRoomStartProps = {
  playersReady: number;
};

export const useRoomStart = ({ playersReady }: useRoomStartProps) => {
  const toast = useToast();
  const [countdown, setCountdown] = useState<number | null>(null);
  const { players } = usePlayersStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    //TODO: Change back to '2' after finished minigame development
    if (playersReady === players.length && players.length >= 1) {
      setCountdown(3);

      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            // TODO: Minigame is hardcoded here, should be dynamic
            socket.emit('start_minigame', EPossibleMinigames.clickTheBomb);
            clearInterval(timerRef.current!);
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    } else {
      setCountdown(null);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [playersReady, players.length]);

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

  return countdown;
};
