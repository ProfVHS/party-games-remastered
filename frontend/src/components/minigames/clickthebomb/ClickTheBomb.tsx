import './ClickTheBomb.scss';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@components/ui/button/Button.tsx';
import Bomb from '@assets/textures/C4.svg?react';
import { socket } from '@socket';

const formatMilisecondsToTimer = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10); // two-digit ms
  return `${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
};

export const ClickTheBomb = () => {
  const [canSkipTurn, setCanSkipTurn] = useState<boolean>(false);
  const [clicksCount, setClicksCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(15000);

  const startTimeRef = useRef<number>();
  const animationRef = useRef<number>();
  const duration = 15000;

  const animate = (timestamp: number) => {
    // Store the starting time
    if (!startTimeRef.current) startTimeRef.current = timestamp;

    // Calculate how much time has passed since the countdown started
    const elapsed = timestamp - startTimeRef.current;

    // Calculate the remaining time, making sure it doesn't go below 0.
    const newTimeLeft = Math.max(duration - elapsed, 0);

    // Update UI with the new time
    setTimeLeft(newTimeLeft);

    if (newTimeLeft > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      stopCountdown();
    }
  };

  const startCountdown = () => {
    stopCountdown();
    startTimeRef.current = undefined; // Allow fresh start on next animate call
    animationRef.current = requestAnimationFrame(animate);
  };

  const stopCountdown = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  };

  const updateClickCount = () => {
    socket.emit('update_click_count');
    stopCountdown();
  };

  useEffect(() => {
    socket.on('received_updated_clicks', (updatedClickCount: number) => {
      setLoading(false);
      setClicksCount(updatedClickCount);
      setTimeLeft(duration);
      startCountdown();
    });

    return () => {
      socket.off('received_updated_clicks');
      stopCountdown();
    };
  }, [socket]);

  useEffect(() => {
    startCountdown();
    return () => stopCountdown();
  }, []);

  return (
    <div className="click-the-bomb">
      <div className="click-the-bomb__info">
        <span className="click-the-bomb__title">Click The Bomb</span>
        <span className="click-the-bomb__turn">user's Turn</span>
      </div>
      <div
        className="click-the-bomb__bomb"
        onClick={() => {
          if (loading) return;
          setLoading(true);
          updateClickCount();
          setCanSkipTurn(true);
        }}
      >
        <Bomb />
        <span className="click-the-bomb__counter">{clicksCount! >= 10 ? clicksCount : '0' + clicksCount}</span>
        <span className="click-the-bomb__timer">{formatMilisecondsToTimer(timeLeft)}</span>
      </div>
      <Button
        className="click-the-bomb__button"
        type="button"
        size="medium"
        isDisabled={!canSkipTurn}
        onClick={() => {
          setCanSkipTurn(false);
        }}
      >
        Next
      </Button>
    </div>
  );
};
