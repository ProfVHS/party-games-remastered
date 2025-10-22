import { useCallback, useEffect, useRef, useState } from 'react';

// Simple hook for smooth millisecond-based countdown animation (Progressbar, Timers with milliseconds)
export const useCountdownAnimation = (initialTime: number, onComplete: () => void) => {
  const initialTimeMs = initialTime * 1000;
  const [animationTimeLeft, setAnimationTimeLeft] = useState<number>(initialTimeMs);
  const startTimeRef = useRef<number>();
  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const callbackRef = useRef(onComplete); // Keep the latest version of the callback in a ref

  const startCountdownAnimation = useCallback(() => {
    stopCountdownAnimation();
    startTimeRef.current = undefined; // Allow fresh start on next animate call
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  const stopCountdownAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  }, []);

  const animate = async (timestamp: number) => {
    // Store the starting time
    if (!startTimeRef.current) startTimeRef.current = timestamp;

    // Calculate how much time has passed since the countdown started
    const elapsed = timestamp - startTimeRef.current;

    // Calculate the remaining time, making sure it doesn't go below 0.
    const newTimeLeft = Math.max(initialTimeMs - elapsed, 0);

    // Update UI with the new time only every 50ms
    if (timestamp - lastUpdateRef.current > 50) {
      setAnimationTimeLeft(newTimeLeft);
      lastUpdateRef.current = timestamp;
    }

    if (newTimeLeft > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      stopCountdownAnimation();
      callbackRef.current();
    }
  };

  useEffect(() => {
    return () => stopCountdownAnimation();
  }, [stopCountdownAnimation]);

  useEffect(() => {
    callbackRef.current = onComplete; // Always call the most recent callback
  }, [onComplete]);

  return { animationTimeLeft, startCountdownAnimation, stopCountdownAnimation };
};
