import { MinigameNamesEnum } from '@shared/types';
import { Cards } from '@components/minigames/cards/Cards';
import { ClickTheBomb } from '@components/minigames/clickthebomb/ClickTheBomb';
import { Scoreboard } from '@components/features/leaderboard/Scoreboard.tsx';
import { Tutorial } from '@components/features/tutorials/Tutorial.tsx';
import { useMinigameSocket } from '../../sockets/minigameSocket.ts';

type MinigameProps = {
  minigameName: MinigameNamesEnum;
  tutorialsEnabled: boolean;
};

export const Minigame = ({ minigameName, tutorialsEnabled }: MinigameProps) => {
  const { startGame, showLeaderboard, showTutorial, scoreboardPlayers } = useMinigameSocket(minigameName, tutorialsEnabled);

  return (
    <div>
      {showLeaderboard ? (
        <Scoreboard scoreboardPlayers={scoreboardPlayers} />
      ) : (
        <>
          {startGame && minigameName == MinigameNamesEnum.clickTheBomb && <ClickTheBomb />}
          {startGame && minigameName == MinigameNamesEnum.cards && <Cards />}
        </>
      )}
      {showTutorial && <Tutorial minigameName={minigameName} />}
    </div>
  );
};
