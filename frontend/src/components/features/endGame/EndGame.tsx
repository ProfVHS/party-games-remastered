import './EndGame.scss';
import { Podium } from '@components/ui/podium/Podium.tsx';
import { sortPlayersByScore } from '@shared/utlis.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import { ProgressBar } from '@components/ui/progressBar/ProgressBar.tsx';
import { COUNTDOWN_FINISHED_MS } from '@shared/constants/gameRules.ts';

export const EndGame = () => {
  const players = usePlayersStore((state) => state.players);
  const sortedPlayers = sortPlayersByScore(players);
  const firstRow = sortedPlayers.length > 5 ? sortedPlayers.slice(0, 3) : sortedPlayers;
  const secondRow = sortedPlayers.length > 5 ? sortedPlayers.slice(3) : [];

  return (
    <div className="end-game">
      <div className="end-game__header">
        <span className="end-game__header__party-games">Party Games</span>
        <span className="end-game__header__title">Podium</span>
      </div>
      <div className="podium__container">
        {firstRow.map((player, index) => (
          <Podium key={index + 1} place={index + 1} player={player} />
        ))}
      </div>
      <div className="podium__container">
        {secondRow.map((player, index) => (
          <Podium key={index + 4} place={index + 4} player={player} />
        ))}
      </div>
      <div className="end-game__footer">
        <ProgressBar durationMs={COUNTDOWN_FINISHED_MS} />
      </div>
    </div>
  );
};
