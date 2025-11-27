import './SmallScreenOverlay.scss';
import { useEffect, useState } from 'react';
import { Icon } from '@assets/icon';
import { MIN_SCREEN_WIDTH } from '@shared/constants/defaults.ts';

export const SmallScreenOverlay = () => {
  const [tooSmall, setTooSmall] = useState<boolean>(false);

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setTooSmall(width < MIN_SCREEN_WIDTH);
    };

    check();

    window.addEventListener('resize', check);

    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <>
      {tooSmall && (
        <div className="screen-overlay">
          <Icon icon="Error" className="icon" />
          <span className="screen-overlay__description">
            This screen is too small to run the game. Please use a device with a minimum width of <b>{MIN_SCREEN_WIDTH}px</b>.
          </span>
        </div>
      )}
    </>
  );
};
