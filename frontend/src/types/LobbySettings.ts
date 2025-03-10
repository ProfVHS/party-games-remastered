import { Minigame } from './Minigame.ts';

export type LobbySettingsType = {
  isRandomMinigames: boolean;
  isTutorialsEnabled: boolean;
  numberOfMinigames?: number;
  minigames?: Minigame[];
};
