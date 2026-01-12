import { MinigameEntryType, RoomSettingsType } from '@shared/types/RoomSettingsType';
import { MINIGAME_REGISTRY } from '../../minigame';

export class RoomSettings {
  private readonly isRandomMinigames: boolean;
  private readonly isTutorialsEnabled: boolean;
  private readonly numberOfMinigames: number;

  private minigames: MinigameEntryType[];

  constructor() {
    this.isRandomMinigames = true;
    this.isTutorialsEnabled = true;
    this.minigames = [];
    this.numberOfMinigames = 2;
  }

  public update = (newSettings: Partial<RoomSettingsType>) => {
    Object.assign(this, newSettings);
  };

  public getMinigames = () => this.minigames;

  public randomiseMinigames = () => {
    if (!this.isRandomMinigames) return { success: false, message: 'Random minigames is disabled!' };
    if (this.numberOfMinigames < 2)
      return {
        success: false,
        message: 'Number of Minigames must be greater than 2!',
      };

    let allMinigames = Object.keys(MINIGAME_REGISTRY);
    const minigames: MinigameEntryType[] = [];

    for (let i = 0; i < this.numberOfMinigames; i++) {
      const index = Math.floor(Math.random() * allMinigames.length);
      minigames.push({ name: allMinigames[index] });

      if (allMinigames.length === 1) {
        allMinigames = Object.keys(MINIGAME_REGISTRY);
      } else {
        allMinigames.splice(index, 1);
      }
    }

    this.minigames = minigames;
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
