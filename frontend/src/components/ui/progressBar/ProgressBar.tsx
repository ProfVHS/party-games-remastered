import './ProgressBar.scss';
import { useEffect, useState } from 'react';
import { useRoomStore } from '@stores/roomStore.ts';
import { GameStateType } from '@shared/types';

type ProgressBarProps = {
  durationMs: number;
};

export const ProgressBar = ({ durationMs }: ProgressBarProps) => {
  const [fillWidth, setFillWidth] = useState(100);
  const roomData = useRoomStore((state) => state.roomData);
  const endAt = roomData?.endAt ?? 0;

  useEffect(() => {
    if (!roomData || roomData.gameState === GameStateType.MinigameOutro) {
      setFillWidth(0);
      return;
    }

    if (!roomData || (roomData.gameState !== GameStateType.Minigame && roomData.gameState !== GameStateType.Finished)) {
      return;
    }

    const interval = setInterval(() => {
      const timeLeft = endAt - Date.now();

      if (timeLeft <= 0) {
        setFillWidth(0);
        clearInterval(interval);
        return;
      }

      const percent = (timeLeft / durationMs) * 100;
      setFillWidth(percent);
    }, 100);

    return () => clearInterval(interval);
  }, [roomData]);

  return (
    <div className="progress__bar">
      <div className="progress__bar__fill" style={{ width: fillWidth + '%' }}></div>
    </div>
  );
};
