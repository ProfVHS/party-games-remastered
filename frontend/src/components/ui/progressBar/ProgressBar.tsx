import './ProgressBar.scss';
import { useEffect, useState } from 'react';

type ProgressBarProps = {
  timeLeft: number;
  duration: number;
};

export const ProgressBar = ({ timeLeft, duration }: ProgressBarProps) => {
  const [fillWidth, setFillWidth] = useState(50);

  useEffect(() => {
    let width = timeLeft / duration / 10;

    if (width < 0.5) {
      width = 0;
    }

    setFillWidth(width);
  }, [timeLeft]);

  return (
    <div className="progress__bar">
      <div className="progress__bar__fill" style={{ width: fillWidth + '%' }}></div>
    </div>
  );
};
