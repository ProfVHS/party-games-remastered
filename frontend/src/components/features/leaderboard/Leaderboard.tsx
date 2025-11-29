import { PlayerType } from '@shared/types';
import { useEffect, useState } from 'react';
import { ScoreboardItem } from '@components/features/leaderboard/Scoreboard.tsx';

type LeaderboardProps = {
  leaderboardPlayers: PlayerType[];
};

export const Leaderboard = ({ leaderboardPlayers }: LeaderboardProps) => {
  const [sortedPlayers, setSortedPlayers] = useState<PlayerType[]>([]);

  useEffect(() => {
    if (!leaderboardPlayers) return;

    const sorted = [...leaderboardPlayers].sort((a, b) => b.score - a.score);
    setSortedPlayers(sorted);
  }, [leaderboardPlayers]);

  return (
    <div className="leaderboard">
      <div className="leaderboard__title">Leaderboard</div>
      <div className="leaderboard__players__container">
        {sortedPlayers.map((player, index) => (
          <ScoreboardItem key={player.id} index={index} nickname={player.nickname} score={player.score} gameBoard={false} />
        ))}
      </div>
    </div>
  );
};
