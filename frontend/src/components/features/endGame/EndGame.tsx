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
          {sortedPlayers[3] && <Podium place={4} nickname={sortedPlayers[3].nickname} score={sortedPlayers[3].score} />}
          {sortedPlayers[1] && <Podium place={2} nickname={sortedPlayers[1].nickname} score={sortedPlayers[1].score} />}
          {sortedPlayers[0] && <Podium place={1} nickname={sortedPlayers[0].nickname} score={sortedPlayers[0].score} />}
          {sortedPlayers[2] && <Podium place={3} nickname={sortedPlayers[2].nickname} score={sortedPlayers[2].score} />}
          {sortedPlayers[4] && <Podium place={5} nickname={sortedPlayers[4].nickname} score={sortedPlayers[4].score} />}
        </div>
      ) : (
        <>
          <div className="podium__container">
            {sortedPlayers[1] && <Podium place={2} nickname={sortedPlayers[1].nickname} score={sortedPlayers[1].score} />}
            {sortedPlayers[0] && <Podium place={1} nickname={sortedPlayers[0].nickname} score={sortedPlayers[0].score} />}
            {sortedPlayers[2] && <Podium place={3} nickname={sortedPlayers[2].nickname} score={sortedPlayers[2].score} />}
          </div>
          <div className="podium__container">
            {sortedPlayers[6] && <Podium place={7} nickname={sortedPlayers[6].nickname} score={sortedPlayers[6].score} />}
            {sortedPlayers[4] && <Podium place={5} nickname={sortedPlayers[4].nickname} score={sortedPlayers[4].score} />}
            {sortedPlayers[3] && <Podium place={4} nickname={sortedPlayers[3].nickname} score={sortedPlayers[3].score} />}
            {sortedPlayers[5] && <Podium place={6} nickname={sortedPlayers[5].nickname} score={sortedPlayers[5].score} />}
            {sortedPlayers[7] && <Podium place={8} nickname={sortedPlayers[7].nickname} score={sortedPlayers[7].score} />}
          </div>
        </>
      )}
    </div>
  );
};
