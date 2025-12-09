import { BaseMinigame } from './BaseMinigame';

export abstract class TurnBasedMinigame extends BaseMinigame {
  protected currentTurn: number = 0;

  public start = () => {
    const playerCount = this.room.players.size;
    this.currentTurn = Math.floor(Math.random() * playerCount);
  };

  public nextTurn = () => {
    for (let i = 1; i <= this.room.players.size; i++) {
      const nextTurn = (this.currentTurn + i) % this.room.players.size;
      const potentialPlayer = Array.from(this.room.players.values())[nextTurn];

      if (potentialPlayer.isAlive && !potentialPlayer.isDisconnected) {
        this.currentTurn = nextTurn;
        return { id: nextTurn, player_id: potentialPlayer.id, nickname: potentialPlayer.nickname };
      }
    }

    throw new Error(`No suitable player found to change turn for room "${this.room.roomCode}".`);
  };
}
