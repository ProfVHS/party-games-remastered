import { MinigameNamesEnum } from "./MinigameType";

export type RoomSettingsType = {
  isRandomMinigames: boolean;
  isTutorialsEnabled: boolean;
  numberOfMinigames: number;
  minigames: MinigameEntryType[];
};

export type MinigameEntryType = {
  name: MinigameNamesEnum;
  id?: string;
};
