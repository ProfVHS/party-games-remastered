import './Leaderboard.scss';
import { useEffect, useState } from 'react';
import { PlayerType } from '@shared/types';

type LeaderboardProps = {
  leaderboardPlayers: PlayerType[];
};

export const Leaderboard = ({ leaderboardPlayers }: LeaderboardProps) => {
  const [sortedPlayers, setSortedPlayers] = useState<PlayerType[]>([]);

  useEffect(() => {
    if (!leaderboardPlayers) return;

    setSortedPlayers([...leaderboardPlayers].sort((a, b) => b.score - a.score));
  }, [leaderboardPlayers]);

  return (
    <div className="leaderboard">
      <div className="leaderboard__title">Leaderboard</div>
      <div className="leaderboard__players__container">
        {sortedPlayers.map((player, index) => (
          <LeaderboardItem key={index} index={index} nickname={player.nickname} score={player.score} />
        ))}
      </div>
    </div>
  );
};

type LeaderboardItemProps = {
  index: number;
  nickname: string;
  score: number;
};

const LeaderboardItem = ({ index, nickname, score }: LeaderboardItemProps) => {
  return (
    <div className="leaderboard__player" key={index}>
      <div className="leaderboard__player__nickname">{index + 1 + '.' + nickname}</div>
      <div className="leaderboard__player__score">{score}</div>
    </div>
  );
};
