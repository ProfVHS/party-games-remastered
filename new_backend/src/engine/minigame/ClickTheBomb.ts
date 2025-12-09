import { TurnBasedMinigame } from './TurnBasedMinigame';
import { Room } from '../Room';
import { MinigameDataType } from '@shared/types';

export class ClickTheBomb extends TurnBasedMinigame {
  constructor(roomInstance: Room, config: MinigameDataType) {
    super(roomInstance, config);
  }

  end(): void {
    // Logic after ending click the bomb
  }
}
