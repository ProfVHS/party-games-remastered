import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ClassNames } from '@utils';

type PrizePoolEffectProps = {
  points: number;
  playerExploded: boolean;
  setExploded: Dispatch<SetStateAction<boolean>>;
};

export const PrizePoolEffect = ({ points, playerExploded, setExploded }: PrizePoolEffectProps) => {
  const [displayedPoints, setDisplayedPoints] = useState(points);
  const [animation, setAnimation] = useState<'none' | 'disappear' | 'appear' | 'bump'>('none');
  const [initialRender, setInitialRender] = useState(true);

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
