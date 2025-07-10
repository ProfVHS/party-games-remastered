import { useEffect, useState, useRef } from 'react';
import './ClickTheBomb.scss';
import { Button } from '../../ui/button/Button.tsx';
import Bomb from '../../../assets/textures/C4.svg?react';
import { formatMilisecondsToTimer } from '../../../utils.ts';
import { socket } from '../../../socket.ts';

export const ClickTheBomb = () => {
  const [canSkipTurn, setCanSkipTurn] = useState<boolean>(false);
  const [clicksCount, setClicksCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(15000);
  const [loading, setLoading] = useState<boolean>(false);
  const intervalRef = useRef<number>(0);

  const startInterval = () => {
    if (intervalRef.current !== 0) stopInterval();
    if (timeLeft <= 0) stopInterval();

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev - 2 >= 0 ? prev - 2 : 0));
    }, 1);
  };

  const stopInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = 0;
  };

  useEffect(() => {
    socket.on('received_updated_clicks', (updatedClickCount: number) => {
      setLoading(false);
      setClicksCount(updatedClickCount);
      startInterval();
      setTimeLeft(15000);
    });

    return () => {
      socket.off('received_updated_clicks');
    };
  }, [socket]);

  const updateClickCount = () => {
    socket.emit('update_click_count');
    stopInterval();
  };

  useEffect(() => {
    if (timeLeft > 0) {
      startInterval();
    }

    return () => stopInterval();
  }, [timeLeft]);

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
