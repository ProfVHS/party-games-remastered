import { MinigameNamesEnum } from '../../types';
import { Cards } from './cards/Cards';
import { ClickTheBomb } from './clickthebomb/ClickTheBomb';

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
