import { useEffect, useRef, useState } from 'react';
import { socket } from '../../socket';
import { MinigamesEnum } from '../../types';
import { usePlayersStore } from '../../stores/playersStore';

type useLobbyStartProps = {
  playersReady: number;
};

export const useLobbyStart = ({ playersReady }: useLobbyStartProps) => {
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
            socket.emit('start_minigame', MinigamesEnum.memoryButtons);
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

  return countdown;
};
