import { MinigameNamesEnum } from '@shared/types';
import { Cards } from '@components/minigames/cards/Cards';
import { ClickTheBomb } from '@components/minigames/clickthebomb/ClickTheBomb';

type MinigameProps = {
  minigameName: string;
};

export const Minigame = ({ minigameName }: MinigameProps) => {
  return (
    <>
      <div>{minigameName == MinigameNamesEnum.clickTheBomb && <ClickTheBomb />}</div>
      <div>{minigameName == MinigameNamesEnum.cards && <Cards />}</div>
      <div>{minigameName == MinigameNamesEnum.colorsMemory && <div>Colors Memory</div>}</div>
    </>
  );
};
