import { MinigameEntryType } from '@shared/types/RoomSettingsType.ts';

export type RoomSettingsType = {
  isRandomMinigames: boolean;
  isTutorialsEnabled: boolean;
  numberOfMinigames: number;
  minigames: MinigameEntryType[];
};
