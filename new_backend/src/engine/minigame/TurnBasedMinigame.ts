import { BaseMinigame } from './BaseMinigame';

export abstract class TurnBasedMinigame extends BaseMinigame {
  public currentTurn: number = 0;

  public start = () => {
    const playerCount = this.players.size;
    this.currentTurn = Math.floor(Math.random() * playerCount);
  };

  public getCurrentTurnPlayer = () => {
    console.log(Array.from(this.players.values()));
    console.log(this.currentTurn);
    return Array.from(this.players.values())[this.currentTurn];
  };

  public alivePlayersCount = () => {
    return Array.from(this.players.values()).filter((player) => player.isAlive).length;
  };

  public getPlayers = () => {
    return Array.from(this.players.values());
  };

  public isLastPlayerStanding = () => {
    return this.alivePlayersCount() === 1;
  };

  public nextTurn = () => {
    this.onNextTurn();

    for (let i = 1; i <= this.players.size; i++) {
      const nextTurn = (this.currentTurn + i) % this.players.size;
      const potentialPlayer = this.getPlayers()[nextTurn];

      if (potentialPlayer.isAlive && !potentialPlayer.isDisconnected) {
        this.currentTurn = nextTurn;
        return { id: nextTurn, player_id: potentialPlayer.id, nickname: potentialPlayer.nickname };
      }
    }

    throw new Error('No suitable player found to change turn.');
  };

  onNextTurn = () => {
    // Logic before skipping turn - implement in Minigame Class
  };
}
