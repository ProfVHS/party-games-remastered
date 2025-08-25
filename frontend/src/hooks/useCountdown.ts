import { useState, useEffect, useRef, useCallback } from 'react';

export const useCountdown = (initialTime: number, intervalMs: number, onComplete: () => void) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [isActive, setIsActive] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  intervalMs *= 1000;

  const startCountdown = useCallback(() => {
    setTimeLeft(initialTime);
    setIsActive(true);
  }, [initialTime]);

  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - intervalMs / 1000;
        if (next <= 0) {
          clearInterval(timerRef.current!);
          setIsActive(false);
          onComplete?.();
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const resetCountdown = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    startCountdown();
  };

  return { timeLeft, startCountdown, resetCountdown };
};
