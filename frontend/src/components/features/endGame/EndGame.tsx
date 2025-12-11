import './EndGame.scss';
import { Podium } from '@components/ui/podium/Podium.tsx';
import { sortPlayersByScore } from '@shared/utlis.ts';
import { usePlayersStore } from '@stores/playersStore.ts';

export const EndGame = () => {
  const { players } = usePlayersStore();
  const sortedPlayers = sortPlayersByScore(players);

  return (
    <div className="end-game">
      <div className="end-game__header">
        <span className="end-game__header__party-games">Party Games</span>
        <span className="end-game__header__title">Podium</span>
      </div>
      {sortedPlayers.length < 6 ? (
        <div className="podium__container lower">
          {sortedPlayers[3] && <Podium place={4} player={sortedPlayers[3]} />}
          {sortedPlayers[1] && <Podium place={2} player={sortedPlayers[1]} />}
          {sortedPlayers[0] && <Podium place={1} player={sortedPlayers[0]} />}
          {sortedPlayers[2] && <Podium place={3} player={sortedPlayers[2]} />}
          {sortedPlayers[4] && <Podium place={5} player={sortedPlayers[4]} />}
        </div>
      ) : (
        <>
          <div className="podium__container">
            {sortedPlayers[1] && <Podium place={2} player={sortedPlayers[1]} />}
            {sortedPlayers[0] && <Podium place={1} player={sortedPlayers[0]} />}
            {sortedPlayers[2] && <Podium place={3} player={sortedPlayers[2]} />}
          </div>
          <div className="podium__container">
            {sortedPlayers[6] && <Podium place={7} player={sortedPlayers[6]} />}
            {sortedPlayers[4] && <Podium place={5} player={sortedPlayers[4]} />}
            {sortedPlayers[3] && <Podium place={4} player={sortedPlayers[3]} />}
            {sortedPlayers[5] && <Podium place={6} player={sortedPlayers[5]} />}
            {sortedPlayers[7] && <Podium place={8} player={sortedPlayers[7]} />}
          </div>
        </>
      )}
    </div>
  );
};
