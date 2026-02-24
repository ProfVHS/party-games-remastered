import { GameStateType, MinigameNamesEnum } from '@shared/types';
import { Cards } from '@components/minigames/cards/Cards';
import { ClickTheBomb } from '@components/minigames/clickthebomb/ClickTheBomb';
import { Tutorial } from '@components/features/tutorials/Tutorial.tsx';
import { TrickyDiamonds } from '@components/minigames/trickydiamonds/TrickyDiamonds.tsx';
import { useRoomStore } from '@stores/roomStore.ts';
import { AnimationOverlay } from '@components/features/animationOverlay/AnimationOverlay.tsx';

type MinigameProps = {
  minigameName: MinigameNamesEnum;
};

export const Minigame = ({ minigameName }: MinigameProps) => {
  const roomData = useRoomStore((state) => state.roomData);

  return (
    <div>
      <>
        {minigameName == MinigameNamesEnum.CLICK_THE_BOMB && <ClickTheBomb />}
        {minigameName == MinigameNamesEnum.CARDS && <Cards />}
        {minigameName == MinigameNamesEnum.TRICKY_DIAMONDS && <TrickyDiamonds />}
      </>
      {roomData?.gameState === GameStateType.MinigameIntro && <AnimationOverlay />}
      {roomData?.gameState === GameStateType.Tutorial && <Tutorial minigameName={minigameName} />}
    </div>
  );
};
