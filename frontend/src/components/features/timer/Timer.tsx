import { ClassNames } from '@utils';
import { useEffect, useState } from 'react';

type TimerProps = {
  className?: string;
  endAt: number;
};

export const Timer = ({ className, endAt }: TimerProps) => {
  const [remainingTime, setRemainingTime] = useState(0);
  useEffect(() => {
    if (!endAt) return;

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
