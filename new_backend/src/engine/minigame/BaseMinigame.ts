import { MinigameDataType } from '@shared/types';
import { Room } from '../Room';

export abstract class BaseMinigame {
  protected config: MinigameDataType;
  protected room: Room;

  constructor(roomInstance: Room, config: MinigameDataType) {
    this.config = config;
    this.room = roomInstance;
  }

  abstract start(): void;

  abstract end(): void;
}
