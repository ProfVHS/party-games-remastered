import './Stopwatch.scss';
import { useEffect, useState } from 'react';

type StopwatchProps = {
  endAt: number;
  durationMs: number;
};

export const Stopwatch = ({ endAt, durationMs }: StopwatchProps) => {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;

  const [timeLeft, setTimeLeft] = useState(() => Math.max(endAt - Date.now(), 0));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(endAt - Date.now(), 0);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [endAt]);

  const progress = timeLeft / durationMs;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="countdown">
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          className="countdown__progress"
          cx="38"
          cy="42"
          r={radius}
          transform="rotate(-90 38 42)"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
        <circle cx="38.1574" cy="42.1052" r="30.8947" stroke="#3C096C" strokeWidth="4" />
        <rect x="3.07031" y="21.1149" width="8.77193" height="8.77193" transform="rotate(-45 3.07031 21.1149)" fill="#3C096C" />
        <rect y="21.1462" width="13.1579" height="6.57895" transform="rotate(-45 0 21.1462)" fill="#5A189A" />
        <rect x="33.7715" y="2.19299" width="8.77193" height="8.77193" fill="#3C096C" />
        <rect x="30.2627" width="15.3509" height="6.57895" fill="#5A189A" />
        <circle cx="38.1583" cy="42.1052" r="21.9298" fill="#B87DE8" />
      </svg>
      <div className="countdown__text">{Math.ceil(timeLeft / 1000)}</div>
    </div>
  );
};
