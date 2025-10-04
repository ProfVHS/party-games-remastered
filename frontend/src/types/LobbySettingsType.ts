export type RoomSettingsType = {
  isRandomMinigames: boolean;
  isTutorialsEnabled: boolean;
  numberOfMinigames: number;
  minigames: MinigameEntryType[];
};

export type MinigameEntryType = {
  name: string;
};

export type MinigameListItemType = MinigameEntryType & {
  id?: string;
};
