import { PlayerType } from '../../../types';
import './Leaderboard.scss';

type LeaderboardProps = {
  players: PlayerType[];
};

export const Leaderboard = ({ players }: LeaderboardProps) => {
  return (
    <div className="leaderboard">
      <h1 className="leaderboard__title">Leaderboard</h1>
      {players
        .sort((a, b) => b.score - a.score)
        .map((player: PlayerType, index: number) => (
          <div className="leaderboard__entry">
            <span className="leaderboard__entry_name">
              {index + 1}. {player.nickname}
            </span>
            <span className="leaderboard__entry_score">{player.score}</span>
          </div>
        ))}
    </div>
  );
};
