import './SmallScreenOverlay.scss';
import { useEffect, useState } from 'react';

export const SmallScreenOverlay = () => {
  const [tooSmall, setTooSmall] = useState<boolean>(false);

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setTooSmall(width < 1000);
    };

    check();

    window.addEventListener('resize', check);

    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <>
      {tooSmall && (
        <div className="screen-overlay">
          <div className="screen-overlay__content">
            <span className="screen-overlay__title">Screen Too Small</span>
            <span className="screen-overlay__description">This screen is too small to run the game. Please use a device with a minimum width of 1000px.</span>
          </div>
        </div>
      )}
    </>
  );
};
