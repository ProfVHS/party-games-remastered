import { BaseMinigame } from './BaseMinigame';
import { Player } from '@engine/core/Player';
import { TurnBaseTimeoutState } from '@backend-types';

export abstract class TurnBasedMinigame extends BaseMinigame {
  public currentTurn: number;
  protected readonly onTimeout: (response: TurnBaseTimeoutState) => void;

  protected constructor(players: Map<string, Player>, roundDuration: number, onTimeout: (state: TurnBaseTimeoutState) => void) {
    super(players, roundDuration, () => {
      this.onTimerEnd();
    });

    this.onTimeout = onTimeout;

    const playerCount = this.getPlayers().filter((p) => p.isAlive()).length;
    this.currentTurn = Math.floor(Math.random() * playerCount);
  }

  public getCurrentTurnPlayer() {
    return this.getPlayers()[this.currentTurn];
  }

  public nextTurn() {
    for (let i = 1; i <= this.players.size; i++) {
      const nextTurn = ((this.currentTurn ?? 0) + i) % this.players.size;
      const potentialPlayer = this.getPlayers()[nextTurn];

      if (potentialPlayer.isAlive() && !potentialPlayer.isDisconnected()) {
        this.currentTurn = nextTurn;

        this.timer.reset();

        return { id: nextTurn, player_id: potentialPlayer.id, nickname: potentialPlayer.nickname };
      }
    }

    throw new Error('No suitable player found to change turn.');
  }

  protected beforeStart() {}

  public abstract onNextTurn(): void;

  protected abstract onTimerEnd(): void;
}
