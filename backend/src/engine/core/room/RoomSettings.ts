import { MinigameEntryType, RoomSettingsType } from '@shared/types/RoomSettingsType';
import { MinigameNamesEnum } from '@shared/types';
import _ from 'lodash';

export class RoomSettings {
  private readonly isRandomMinigames: boolean;
  private readonly isTutorialsEnabled: boolean;
  private readonly numberOfMinigames: number;
  private readonly shownTutorials: MinigameNamesEnum[];

  private minigames: MinigameEntryType[];

  constructor() {
    this.isRandomMinigames = true;
    this.isTutorialsEnabled = true;
    this.minigames = [];
    this.numberOfMinigames = 2;
    this.shownTutorials = [];
  }

  public update(newSettings: Partial<RoomSettingsType>) {
    Object.assign(this, newSettings);
  }

  public getMinigames() {
    return this.minigames;
  }

  public getNextMinigame() {
    const nextMinigame = this.minigames[0];
    this.minigames = this.minigames.slice(1);
    return nextMinigame;
  }

  public isLastMinigame() {
    return this.minigames.length <= 0;
  }

  public addShownTutorials(minigame: MinigameNamesEnum) {
    this.shownTutorials.push(minigame);
  }

  public getShownTutorials() {
    return this.shownTutorials;
  }

  public randomiseMinigames() {
    if (!this.isRandomMinigames) return { success: false, message: 'Random minigames is disabled!' };
    if (this.numberOfMinigames < 2)
      return {
        success: false,
        message: 'Number of Minigames must be greater than 2!',
      };

    const allowDuplicates = false;

    const allMinigames = Object.values(MinigameNamesEnum);
    let selected: MinigameNamesEnum[];

    if (allowDuplicates) {
      selected = Array.from({ length: this.numberOfMinigames }, () => _.sample(allMinigames)!);
    } else {
      selected = _.shuffle(allMinigames).slice(0, this.numberOfMinigames);
    }

    this.minigames = selected.map((name, index) => ({
      name,
      id: `${name}-${index}`,
    }));
  }

  public getData() {
    return {
      isRandomMinigames: this.isRandomMinigames,
      isTutorialsEnabled: this.isTutorialsEnabled,
      minigames: this.minigames,
      numberOfMinigames: this.numberOfMinigames,
    };
  }
}
