import './EndGame.scss';
import { Podium } from '@components/ui/podium/Podium.tsx';
import { usePlayersStore } from '@stores/playersStore.ts';

export const EndGame = () => {
  const { players } = usePlayersStore();

  return (
    <div className="end-game">
      <div className="end-game__header">
        <span className="end-game__header__party-games">Party Games</span>
        <span className="end-game__header__title">Podium</span>
      </div>
      {players.length < 6 ? (
        <div className="podium__container lower">
          <Podium place={4} nickname={'Player'} score={20000} />
          <Podium place={2} nickname={'Player'} score={200} />
          <Podium place={1} nickname={'Player'} score={300} />
          <Podium place={3} nickname={'Player'} score={100} />
          <Podium place={5} nickname={'Player'} score={100} />
        </div>
      ) : (
        <>
          <div className="podium__container">
            <Podium place={2} nickname={'Player'} score={200} />
            <Podium place={1} nickname={'Player'} score={300} />
            <Podium place={3} nickname={'Player'} score={100} />
          </div>
          <div className="podium__container">
            <Podium place={7} nickname={'Player'} score={200} />
            <Podium place={5} nickname={'Player'} score={200} />
            <Podium place={4} nickname={'Player'} score={300} />
            <Podium place={6} nickname={'Player'} score={100} />
            <Podium place={8} nickname={'Player'} score={100} />
          </div>
        </>
      )}
    </div>
  );
};
