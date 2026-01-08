import { MinigameDataType } from '@shared/types';
import { Player } from '../Player';

export abstract class BaseMinigame {
  protected config: MinigameDataType;
  protected players: Map<string, Player>;

  constructor(players: Map<string, Player>, config: MinigameDataType) {
    this.config = config;
    this.players = players;
  }

  abstract start(): void;

  abstract end(): void;
}
