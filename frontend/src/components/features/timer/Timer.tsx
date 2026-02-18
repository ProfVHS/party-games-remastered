import { ClassNames } from '@utils';
import { useEffect, useState } from 'react';
import { useRoomStore } from '@stores/roomStore.ts';
import { GameStateType } from '@shared/types';

type TimerProps = {
  className?: string;
};

export const Timer = ({ className }: TimerProps) => {
  const [remainingTime, setRemainingTime] = useState(0);
  const roomData = useRoomStore((state) => state.roomData);

  const gameState = roomData?.gameState;
  const endAt = roomData?.endAt ?? 0;

  useEffect(() => {
    if (!endAt || gameState !== GameStateType.Minigame) return;

    const interval = setInterval(() => setRemainingTime(Math.max(0, endAt - Date.now())), 10);

    return () => clearInterval(interval);
  }, [endAt]);

  const formatMillisecondsToTimer = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  };

  return <span className={ClassNames('timer', className)}>{formatMillisecondsToTimer(remainingTime)}</span>;
};
