import { useState, useEffect, useRef } from 'react';
import { CurrentMinigameDataType, GameRoomDataType, PlayerType } from '../../../types';
import { Leaderboard } from './Leaderboard';
import { GamePreview } from './GamePreview';

type MemoryButtonsProps = {
  players: PlayerType[];
  minigame: GameRoomDataType;
};

export const MemoryButtons = ({ players, minigame }: MemoryButtonsProps) => {
  const [loadingStage, setLoadingStage] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const colourSequence = useRef<number[] | null>(null);
  const minigameData: CurrentMinigameDataType = minigame.currentMinigameData;
  const [playerClickCount, setPlayerClickCount] = useState<number>(0);

  useEffect(() => {
    if (minigameData.type === 'memoryButtons') colourSequence.current = minigameData.colourSequence;
  }, []);

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

  const handleColourClick = (id: number) => {
    if (id === colourSequence.current![playerClickCount]) {
      setPlayerClickCount((prev) => prev + 1);
      //Reset the timer
    } else {
      //Player loses here
    }
  };

  return (
    <>
      {loadingStage === 0 && <Leaderboard players={players} />}
      {loadingStage === 1 && <GamePreview minigame={minigame} />}
      {loadingStage === 2 && (
        <div className="memory-buttons">
          <div onClick={() => handleColourClick(1)} className="memory-buttons__colour-cell"></div>
          <div onClick={() => handleColourClick(2)} className="memory-buttons__colour-cell"></div>
          <div onClick={() => handleColourClick(3)} className="memory-buttons__colour-cell"></div>

          <div onClick={() => handleColourClick(4)} className="memory-buttons__colour-cell"></div>
          <div onClick={() => handleColourClick(5)} className="memory-buttons__colour-cell"></div>
          <div onClick={() => handleColourClick(6)} className="memory-buttons__colour-cell"></div>

          <div onClick={() => handleColourClick(7)} className="memory-buttons__colour-cell"></div>
          <div onClick={() => handleColourClick(8)} className="memory-buttons__colour-cell"></div>
          <div onClick={() => handleColourClick(9)} className="memory-buttons__colour-cell"></div>
        </div>
      )}
    </>
  );
};
