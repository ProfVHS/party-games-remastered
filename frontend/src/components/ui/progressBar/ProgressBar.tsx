import './ProgressBar.scss';
import { useEffect, useState } from 'react';

type ProgressBarProps = {
  endAt: number;
  duration: number;
};

export const ProgressBar = ({ endAt, duration }: ProgressBarProps) => {
  const [fillWidth, setFillWidth] = useState(100);

  useEffect(() => {
    if (!endAt || endAt == 0) return;

    const interval = setInterval(() => {
      const timeLeft = endAt - Date.now();

      if (timeLeft <= 0) {
        setFillWidth(0);
        clearInterval(interval);
        return;
      }

      const percent = (timeLeft / duration) * 100;
      setFillWidth(percent);
    }, 100);

    return () => clearInterval(interval);
  }, [endAt, duration]);

  return (
    <div className="progress__bar">
      <div className="progress__bar__fill" style={{ width: fillWidth + '%' }}></div>
    </div>
  );
};
