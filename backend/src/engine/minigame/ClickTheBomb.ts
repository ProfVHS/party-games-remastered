import { TurnBasedMinigame } from './base/TurnBasedMinigame';
import { Player } from '@engine/core/Player';
import { TurnBaseTimeoutState } from '@backend-types';

const COUNTDOWN_MS = 10000;
const LOSS = 50;
const POINTS = [8, 10, 12, 14, 14, 16];

export class ClickTheBomb extends TurnBasedMinigame {
  private clickCount: number = 0;
  private streak: number = 0;
  private prizePool: number = 0;
  private maxClicks: number = 0;

  constructor(players: Map<string, Player>, onTurnTimeout: (state: TurnBaseTimeoutState) => void) {
    super(players, COUNTDOWN_MS, onTurnTimeout);
  }

  private setupBomb() {
    this.clickCount = 0;
    this.maxClicks = Math.floor(Math.random() * (this.alivePlayersCount() * 3)) + 1;
    this.streak = 0;
    this.prizePool = 0;
  }

  private incrementCounter() {
    this.clickCount++;
    this.streak++;

    const prizePoolDelta = this.streak > POINTS.length - 1 ? POINTS.at(-1) || 0 : POINTS[this.streak - 1];
    this.prizePool += prizePoolDelta;
  }

  private grantPrizePool() {
    const currentPlayer = this.getCurrentTurnPlayer();
    currentPlayer.addScore(this.prizePool);

    this.prizePool = 0;
    this.streak = 0;
  }

  private explode() {
    const player = this.getCurrentTurnPlayer();
    if (player) {
      player.kill();
      player.subtractScore(LOSS);
    }

    if (this.isLastPlayerStanding()) {
      this.end();
      return { success: true, state: 'END_GAME' };
    }

    this.nextTurn();
    this.setupBomb();
    this.timer.clear();
    return { success: true, state: 'NEXT_TURN' };
  }

  public click() {
    this.timer.reset();

    if (this.maxClicks <= this.clickCount + 1) return this.explode();

    this.incrementCounter();
    return { success: true, state: 'INCREMENTED' };
  }

  public getState() {
    const { clickCount, streak, prizePool } = this;
    return { clickCount, streak, prizePool, prizePoolIncrease: POINTS[streak - 1] ?? POINTS[POINTS.length - 1] };
  }

  public onNextTurn() {
    this.grantPrizePool();
  }

  protected onTimerEnd() {
    const response = this.explode();

    this.onTimeout(response as TurnBaseTimeoutState);
  }

  protected beforeStart() {
    super.beforeStart();
    this.setupBomb();
  }

  protected end() {
    this.players.forEach((player: Player) => {
      player.revive();
    });

    this.timer.clear();
  }

  public getCountdownDuration(): number {
    return COUNTDOWN_MS;
  }
}
