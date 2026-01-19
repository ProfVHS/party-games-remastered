import { Player } from '../../core/Player';
import { Timer } from '../../core/Timer';

export abstract class BaseMinigame {
  protected players: Map<string, Player>;
  protected timer: Timer;

  constructor(players: Map<string, Player>, timerDuration: number, onTimerEnd: () => void) {
    this.players = players;
    this.timer = new Timer(timerDuration, () => {
      this.onTimerEnd();
      onTimerEnd();
    });
  }

  public alivePlayersCount = () => {
    return this.getPlayers().filter((player) => player.isAlive()).length;
  };

  public getPlayers = () => {
    return Array.from(this.players.values());
  };

  public isLastPlayerStanding = () => {
    return this.alivePlayersCount() === 1;
  };

  start = () => {
    this.beforeStart();
    this.onStart();
  };

  protected beforeStart = () => {};

  protected onStart = () => {};

  protected abstract end(): void;

  protected abstract onTimerEnd(): void;
}
