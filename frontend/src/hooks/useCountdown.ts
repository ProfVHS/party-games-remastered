import { useEffect, useRef, useState } from 'react';

export function useCountdown() {
  const countdown = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [endAt, setEndAt] = useState<number | null>(null);

  useEffect(() => {
    if (endAt === null) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const diff = Math.max(endAt - Date.now(), 0);
      return Math.ceil(diff / 1000);
    };

    setTimeLeft(calculateTimeLeft());

    countdown.current = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0 && countdown.current) {
        clearInterval(countdown.current);
        countdown.current = null;
      }
    }, 1000);

    return () => {
      if (countdown.current) {
        clearInterval(countdown.current);
        countdown.current = null;
      }
    };
  }, [endAt]);

  return { timeLeft, setEndAt };
}
