import { useEffect, useState } from 'react';
import { ClassNames } from '@utils';
import { useClickTheBombSocket } from '@sockets/clickTheBombSocket.ts';

type PrizePoolEffectProps = {
  points: number;
  playerExploded: boolean;
};

export const PrizePoolEffect = ({ points, playerExploded }: PrizePoolEffectProps) => {
  const [displayedPoints, setDisplayedPoints] = useState(points);
  const [animation, setAnimation] = useState<'none' | 'disappear' | 'appear' | 'bump'>('none');
  const [initialRender, setInitialRender] = useState(true);

  const { setExploded } = useClickTheBombSocket();

  useEffect(() => {
    // Skip animation on first render
    if (initialRender) {
      setInitialRender(false);
      setDisplayedPoints(points);
      return;
    }

    // When points increase (e.g. 0 -> 15) -> trigger bump animation
    if (points > displayedPoints) {
      setDisplayedPoints(points);
      setAnimation('bump');
      setTimeout(() => setAnimation('none'), 300);
      return;
    }

    // For any other change, just update without animation
    setDisplayedPoints(points);
    setAnimation('none');
  }, [points]);

  useEffect(() => {
    // When points drop to 0 -> trigger disappear, then appear with +0
    if (playerExploded) {
      setAnimation('disappear');
      setTimeout(() => {
        setDisplayedPoints(0);
        setAnimation('appear');
        setExploded(false);
      }, 500);
      return;
    }
  }, [points, playerExploded]);

  return (
    <div
      className={ClassNames('click-the-bomb__prize__value', {
        appear: animation === 'appear',
        disappear: animation === 'disappear',
        bump: animation === 'bump',
      })}
    >
      +{displayedPoints}
    </div>
  );
};
