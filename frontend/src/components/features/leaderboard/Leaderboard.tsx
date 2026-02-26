import { ScoreboardItem } from '@components/features/leaderboard/ScoreboardItem.tsx';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useEffect } from 'react';
import {sortBy} from 'lodash';

export const Leaderboard = () => {
  const players = usePlayersStore((state) => state.players);
  const setOldPlayers = usePlayersStore((state) => state.setOldPlayers);
  const sortedPlayers = sortBy(players, 'score');

  useEffect(() => {
    setOldPlayers(players);
  }, []);

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
