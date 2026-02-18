import { BaseMinigame } from './BaseMinigame';
import { Player } from '@engine/core/Player';
import { TurnBaseTimeoutState } from '@backend-types';

export abstract class TurnBasedMinigame extends BaseMinigame {
  public currentTurn: number = 0;
  protected readonly onTimeout: (state: TurnBaseTimeoutState) => void;

  protected constructor(players: Map<string, Player>, roundDuration: number, onTimeout: (state: TurnBaseTimeoutState) => void) {
    super(players, roundDuration, () => {
      this.onTurnEnd();
    });

    this.onTimeout = onTimeout;
  }

  public getCurrentTurnPlayer() {
    return Array.from(this.players.values())[this.currentTurn];
  }

  public nextTurn() {
    this.onNextTurn();

    for (let i = 1; i <= this.players.size; i++) {
      const nextTurn = (this.currentTurn + i) % this.players.size;
      const potentialPlayer = this.getPlayers()[nextTurn];

      if (potentialPlayer.isAlive() && !potentialPlayer.isDisconnected()) {
        this.currentTurn = nextTurn;
        return { id: nextTurn, player_id: potentialPlayer.id, nickname: potentialPlayer.nickname };
      }
    }

    throw new Error('No suitable player found to change turn.');
  }

  protected beforeStart() {
    const playerCount = this.players.size;
    this.currentTurn = Math.floor(Math.random() * playerCount);
  }

  protected abstract onNextTurn(): void;

  protected abstract onTurnEnd(): void;
}
