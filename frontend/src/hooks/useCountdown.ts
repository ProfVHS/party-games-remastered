import { useState, useEffect, useRef, useCallback } from 'react';

// Simple hook for second-based countdowns (10, 9, 8, ...)
export const useCountdown = (initialTime: number, intervalSeconds: number, onComplete: () => void) => {
  const intervalMs = intervalSeconds * 1000;
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [isActive, setIsActive] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(onComplete); // Keep the latest version of the callback in a ref

  const startCountdown = useCallback(() => {
    setTimeLeft(initialTime);
    setIsActive(true);
  }, [initialTime]);

  const stopCountdown = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - intervalMs / 1000;
        if (next <= 0) {
          clearInterval(timerRef.current!);
          setIsActive(false);
          callbackRef.current();
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    callbackRef.current = onComplete; // Always call the most recent callback
  }, [onComplete]);

  return { timeLeft, startCountdown, stopCountdown };
};
