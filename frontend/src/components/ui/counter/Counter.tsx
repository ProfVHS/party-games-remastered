import { animate, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

type CounterProps = {
  count: number;
  duration: number;
};

export const Counter = ({ count, duration }: CounterProps) => {
  const value = useMotionValue(0);
  const rounded = useTransform(value, (latest) => Math.round(latest));

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(value, count, { duration: duration });
    return controls.stop;
  }, [value, count]);

  useEffect(() => {
    return rounded.on('change', (v) => setDisplay(v));
  }, [rounded]);

  return <span className="counter">{display}</span>;
};
