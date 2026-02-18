import { GameStateType, MinigameNamesEnum } from '@shared/types';
import { Cards } from '@components/minigames/cards/Cards';
import { ClickTheBomb } from '@components/minigames/clickthebomb/ClickTheBomb';
import { Tutorial } from '@components/features/tutorials/Tutorial.tsx';
import { useMinigameSocket } from '@sockets/minigameSocket.ts';
import { TrickyDiamonds } from '@components/minigames/trickydiamonds/TrickyDiamonds.tsx';
import { useRoomStore } from '@stores/roomStore.ts';
import { AnimationOverlay } from '@components/features/animationOverlay/AnimationOverlay.tsx';

type MinigameProps = {
  minigameName: MinigameNamesEnum;
};

export const Minigame = ({ minigameName }: MinigameProps) => {
  const { startGame, showTutorial } = useMinigameSocket(minigameName, false);
  const roomData = useRoomStore((state) => state.roomData);

  return (
    <div style={{ position: 'relative' }}>
      <>
        {startGame && minigameName == MinigameNamesEnum.clickTheBomb && <ClickTheBomb />}
        {startGame && minigameName == MinigameNamesEnum.cards && <Cards />}
        {startGame && minigameName == MinigameNamesEnum.trickyDiamonds && <TrickyDiamonds />}
      </>
      {roomData?.gameState === GameStateType.Animation && <AnimationOverlay />}
      {showTutorial && <Tutorial minigameName={minigameName} />}
    </div>
  );
};
