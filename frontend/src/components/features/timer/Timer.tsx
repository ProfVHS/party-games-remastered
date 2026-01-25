import { useCountdownAnimation } from '@hooks/useCountdownAnimation.ts';
import { CLICK_THE_BOMB_RULES } from '@shared/constants/gameRules.ts';
import { useEffect } from 'react';
import { ClassNames } from '@utils';

const formatMillisecondsToTimer = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10); // two-digit ms
  return `${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
};

type TimerProps = {
  className?: string;
};

export const Timer = ({ className }: TimerProps) => {
  const { animationTimeLeft, startCountdownAnimation } = useCountdownAnimation(CLICK_THE_BOMB_RULES.COUNTDOWN, () => {
    console.log('timer end');
  });

  useEffect(() => {
    startCountdownAnimation();
  }, []);

  return <span className={ClassNames('timer', className)}>{formatMillisecondsToTimer(animationTimeLeft)}</span>;
};
