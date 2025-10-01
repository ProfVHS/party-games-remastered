import { usePlayersStore } from '@stores/playersStore';
import './Leaderboard.scss';
import { useEffect, useState } from 'react';
import { PlayerType } from '@shared/types';

export const Leaderboard = () => {
  const { players } = usePlayersStore();
  const [sortedPlayers, setSortedPlayers] = useState<PlayerType[]>([]);

  //TODO: Second leaderboard for game (how many points did you get, extra stats )

  useEffect(() => {
    if (!players) return;
    setSortedPlayers([...players].sort((a, b) => Number(b.score) - Number(a.score)));
  }, [players]);

  return (
    <div className="leaderboard">
      <div className="leaderboard__title">Leaderboard</div>
      <div className="leaderboard__players__container">
        {sortedPlayers.map((player, index) => (
          <div className={`leaderboard__player`} key={index}>
            <div className="leaderboard__player__nickname">{index + 1 + '.' + player.nickname}</div>
            <div className="leaderboard__player__score">{player.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
