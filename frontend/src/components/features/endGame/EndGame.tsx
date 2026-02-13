import './EndGame.scss';
import { Podium } from '@components/ui/podium/Podium.tsx';
import { sortPlayersByScore } from '@shared/utlis.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import { PlayerType } from '@shared/types';
import { useEffect, useState } from 'react';

export const EndGame = () => {
  const players = usePlayersStore((state) => state.players);
  const sortedPlayers = sortPlayersByScore(players);
  const [firstRow, setFirstRow] = useState<PlayerType[]>([]);
  const [secondRow, setSecondRow] = useState<PlayerType[]>([]);

  useEffect(() => {
    if (sortedPlayers.length > 5) {
      setFirstRow(sortedPlayers.slice(0, 3));
      setSecondRow(sortedPlayers.slice(3));
    } else {
      setFirstRow(sortedPlayers);
    }
  }, [sortedPlayers]);

  return (
    <div className="end-game">
      <div className="end-game__header">
        <span className="end-game__header__party-games">Party Games</span>
        <span className="end-game__header__title">Podium</span>
      </div>
      <div className="podium__container">
        {firstRow.map((player, index) => (
          <Podium place={index + 1} player={player} />
        ))}
      </div>
      <div className="podium__container">
        {secondRow.map((player, index) => (
          <Podium place={index + 4} player={player} />
        ))}
      </div>
    </div>
  );
};
