import { MinigameEntryType } from '@shared/types/RoomSettingsType';

export class RoomSettings {
  public isRandomMinigames: boolean;
  public isTutorialsEnabled: boolean;
  public minigames: MinigameEntryType[];
  public numberOfMinigames: number;

  constructor() {
    this.isRandomMinigames = false;
    this.isTutorialsEnabled = true;
    this.minigames = [];
    this.numberOfMinigames = 2;
  }

  public update = (newSettings: Partial<RoomSettings>) => {
    Object.assign(this, newSettings);
  };

  public getData = () => {
    return {
      isRandomMinigames: this.isRandomMinigames,
      isTutorialsEnabled: this.isTutorialsEnabled,
      minigames: this.minigames,
      numberOfMinigames: this.numberOfMinigames,
    };
  };
}
