import { MinigameEntryType } from './MinigameType.ts';

export type LobbySettingsType = {
  isRandomMinigames: boolean;
  isTutorialsEnabled: boolean;
  numberOfMinigames?: number;
  minigames?: MinigameEntryType[];
};
