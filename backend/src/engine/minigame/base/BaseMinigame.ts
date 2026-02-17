import { Player } from '@engine-core/Player';
import { Timer } from '@engine-core/Timer';

export abstract class BaseMinigame {
  protected players: Map<string, Player>;
  protected timer: Timer;

  protected constructor(players: Map<string, Player>, timerDurationMs: number, onTimerEnd: () => void) {
    this.players = players;
    this.timer = new Timer(timerDurationMs, () => {
      this.onTimerEnd();
      onTimerEnd();
    });
  }

  protected alivePlayersCount() {
    return this.getPlayers().filter((player) => player.isAlive()).length;
  }

  protected getPlayers() {
    return Array.from(this.players.values());
  }

  protected isLastPlayerStanding() {
    return this.alivePlayersCount() <= 1;
  }

  public getTimer() {
    return this.timer;
  }

  public start() {
    this.beforeStart();
    this.timer.start();
  }

  protected abstract beforeStart(): void;

  protected abstract end(): void;

  protected abstract onTimerEnd(): void;
}
