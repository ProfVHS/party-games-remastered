import './Scoreboard.scss';
import { ClassNames } from '@utils';
import { useEffect, useState } from 'react';
import { PlayerType } from '@shared/types';
import { Leaderboard } from '@components/features/leaderboard/Leaderboard.tsx';
import { GameResults } from '@components/features/leaderboard/GameResults.tsx';

type ScoreboardProps = {
  scoreboardPlayers: PlayerType[];
};

export const Scoreboard = ({ scoreboardPlayers }: ScoreboardProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 3000);
  }, [scoreboardPlayers]);

  return <>{show ? <Leaderboard leaderboardPlayers={scoreboardPlayers} /> : <GameResults gameResultsPlayers={scoreboardPlayers} />}</>;
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
