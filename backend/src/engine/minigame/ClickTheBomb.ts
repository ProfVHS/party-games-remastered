import { TurnBasedMinigame } from './base/TurnBasedMinigame';
import { Player } from '@engine/core/Player';
import { TurnBaseTimeoutState } from '@backend-types';

const POINTS = [15, 17, 20, 23, 26, 30, 35];
const LOSS = 50;
const MAX_MS_TO_CLICK = 5000;

export class ClickTheBomb extends TurnBasedMinigame {
  private clickCount: number = 0;
  private streak: number = 0;
  private prizePool: number = 0;
  private maxClicks: number = 0;

  constructor(players: Map<string, Player>, onTurnTimeout: (state: TurnBaseTimeoutState) => void) {
    super(players, MAX_MS_TO_CLICK, onTurnTimeout);
  }

  private setupBomb() {
    this.clickCount = 0;
    this.maxClicks = Math.floor(Math.random() * (this.alivePlayersCount() * 4)) + 1;
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
    player.kill();
    player.subtractScore(LOSS);

    if (this.isLastPlayerStanding()) {
      this.end();
      return { success: true, state: 'END_GAME' };
    }

    this.nextTurn();
    this.setupBomb();
    return { success: true, state: 'PLAYER_EXPLODED' };
  }

  public click() {
    this.timer.reset();

    if (this.maxClicks === this.clickCount) return this.explode();

    this.incrementCounter();
    return { success: true, state: 'INCREMENTED' };
  }

  public getState() {
    const { clickCount, streak, prizePool } = this;
    return { clickCount, streak, prizePool };
  }

  onNextTurn() {
    this.grantPrizePool();
  }

  onTurnEnd() {
    const player = this.getCurrentTurnPlayer();
    player.subtractScore(LOSS);
    player.kill();

    if (this.isLastPlayerStanding()) {
      this.onTimeout('END_GAME');
      return;
    }

    //TODO: Uncomment
    //this.nextTurn();
    this.setupBomb();
    this.onTimeout('NEXT_TURN');
    this.introTimer.reset();
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

  protected onTimerEnd() {}
}
