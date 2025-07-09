import { useEffect, useState } from 'react';
import './ClickTheBomb.scss';
import { Button } from '../../ui/button/Button.tsx';
import Bomb from '../../../assets/textures/C4.svg?react';
import { formatMilisecondsToTimer } from '../../../utils.ts';

export const ClickTheBomb = () => {
  const [canSkipTurn, setCanSkipTurn] = useState<boolean>(false);
  const [clicksCount, setClicksCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(15000);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev - 2 >= 0 ? prev - 2 : 0));
    }, 1);
    return () => clearInterval(interval);
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
          setClicksCount((prev) => prev + 1);
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
