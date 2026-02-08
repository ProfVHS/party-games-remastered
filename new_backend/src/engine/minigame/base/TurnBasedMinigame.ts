import { BaseMinigame } from './BaseMinigame';
import { Player } from '@engine/core/Player';
import { TurnBaseTimeoutState } from '@backend-types';

export abstract class TurnBasedMinigame extends BaseMinigame {
  public currentTurn: number = 0;

  protected constructor(players: Map<string, Player>, roundDuration: number, onTurnTimeout: (state: TurnBaseTimeoutState) => void) {
    super(players, roundDuration, () => {
      onTurnTimeout(this.isLastPlayerStanding() ? 'END_GAME' : 'NEXT_TURN');
    });
  }

  public getCurrentTurnPlayer = () => {
    return Array.from(this.players.values())[this.currentTurn];
  };

  public nextTurn = () => {
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
  };

  beforeStart = () => {
    const playerCount = this.players.size;
    this.currentTurn = Math.floor(Math.random() * playerCount);
    this.timer.start();
  };

  onNextTurn = () => {
    // Logic before skipping turn - implement in Minigame Class
  };
}
