import { PlayerType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';
import { ScoreboardItem } from '@components/features/leaderboard/Scoreboard.tsx';

type GameResultsProps = {
  gameResultsPlayers: PlayerType[];
};

export const GameResults = ({ gameResultsPlayers }: GameResultsProps) => {
  const { oldPlayers } = usePlayersStore();

  const playersWithGains = gameResultsPlayers.map((player) => {
    const oldPlayer = oldPlayers?.find((p) => p.id === player.id);
    const oldScore = oldPlayer ? oldPlayer.score : 0;

    return {
      ...player,
      gain: player.score - oldScore,
    };
  });

  const sortedByGain = [...playersWithGains].sort((a, b) => b.gain - a.gain);

  return (
    <div className="game-results">
      <div className="game-results__title">Game Results</div>
      <div className="game-results__players__container">
        {sortedByGain.map((player, index) => (
          <ScoreboardItem key={player.id} index={index} nickname={player.nickname} score={player.gain} gameBoard={true} />
        ))}
      </div>
    </div>
  );
};
