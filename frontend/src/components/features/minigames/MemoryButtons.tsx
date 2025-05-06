import { useState, useEffect, useRef } from 'react';
import { PlayerType } from '../../../types';
import { Leaderboard } from './Leaderboard';
import { GamePreview } from './GamePreview';

type MemoryButtonsProps = {
  players: PlayerType[];
};

export const MemoryButtons = ({ players }: MemoryButtonsProps) => {
  const [loadingStage, setLoadingStage] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  //TODO: Probably bad approach, think about it later
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setLoadingStage(1);
      timerRef.current = setTimeout(() => {
        setLoadingStage(2);
      }, 5000);
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {loadingStage === 0 && <Leaderboard players={players} />}
      {loadingStage === 1 && <GamePreview />}
      {loadingStage === 2 && <h1>Actual Game here</h1>}
    </>
  );
};
