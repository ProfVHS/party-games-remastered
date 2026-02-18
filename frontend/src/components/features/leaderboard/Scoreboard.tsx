import './Scoreboard.scss';
import { ClassNames } from '@utils';
import { useEffect, useState } from 'react';
import { Leaderboard } from '@components/features/leaderboard/Leaderboard.tsx';
import { GameResults } from '@components/features/leaderboard/GameResults.tsx';
import { useRoomStore } from '@stores/roomStore.ts';

export const Scoreboard = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const roomData = useRoomStore((state) => state.roomData);

  useEffect(() => {
    if (!roomData?.endAt || roomData.gameState !== 'LEADERBOARD') {
      setShowLeaderboard(false);
      return;
    }

    const now = Date.now();
    const totalTimeLeft = roomData.endAt - now;

    if (totalTimeLeft <= 0) {
      setShowLeaderboard(true);
      return;
    }

    const halfTime = totalTimeLeft / 2;

    const timer = setTimeout(() => {
      setShowLeaderboard(true);
    }, halfTime);

    return () => clearTimeout(timer);
  }, [roomData]);

  return showLeaderboard ? <Leaderboard /> : <GameResults />;
};

type ScoreboardItemProps = {
  index: number;
  nickname: string;
  score: number;
  gameBoard: boolean;
};

export const ScoreboardItem = ({ index, nickname, score, gameBoard }: ScoreboardItemProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!gameBoard) setVisible(true);
    else setTimeout(() => setVisible(true), index * 200);
  }, [gameBoard]);

  return (
    <div className={ClassNames('scoreboard__player', { visible: visible })}>
      <div className="scoreboard__player__nickname">{index + 1 + '. ' + nickname}</div>
      <div className="scoreboard__player__score">{score >= 0 && gameBoard ? '+' + score : score}</div>
    </div>
  );
};
