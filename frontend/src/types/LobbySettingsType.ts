import { TMinigameEntry } from './MinigameType.ts';

export type LobbySettingsType = {
  isRandomMinigames: boolean;
  isTutorialsEnabled: boolean;
  numberOfMinigames?: number;
  minigames?: TMinigameEntry[];
};
