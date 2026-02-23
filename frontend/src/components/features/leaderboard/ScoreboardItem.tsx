import './ScoreboardItem.scss';
import { useEffect, useState } from 'react';
import { ClassNames } from '@utils';

type ScoreboardItemProps = {
  index: number;
  nickname: string;
  score: number;
  gameBoard: boolean;
};

export const ScoreboardItem = ({ index, nickname, score, gameBoard }: ScoreboardItemProps) => {
  const [visible, setVisible] = useState(false);
  const displayNickname = `${index + 1 + '. ' + nickname}`;
  const displayScore = score >= 0 && gameBoard ? `+${score}` : score;

  useEffect(() => {
    if (!gameBoard) setVisible(true);
    else setTimeout(() => setVisible(true), index * 200);
  }, [gameBoard]);

  return (
    <div className={ClassNames('scoreboard-item', { visible: visible })}>
      <div className="scoreboard-item__nickname">{displayNickname}</div>
      <div className="scoreboard-item__score">{displayScore}</div>
    </div>
  );
};
