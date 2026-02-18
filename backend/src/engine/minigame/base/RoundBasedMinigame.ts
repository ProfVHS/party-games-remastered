import { BaseMinigame } from './BaseMinigame';
import { Player } from '@engine/core/Player';
import { Timer } from '@engine/core/Timer';
import { RoundBaseTimeoutState } from '@backend-types';

export abstract class RoundBasedMinigame extends BaseMinigame {
  protected round: number = 1;
  private readonly maxRounds: number;
  private roundSummaryTimer: Timer;
  private readonly onTimeout: (state: RoundBaseTimeoutState) => void;

  protected constructor(
    players: Map<string, Player>,
    roundDurationMs: number,
    roundSummaryDurationMs: number,
    maxRounds: number,
    onTimeout: (state: RoundBaseTimeoutState) => void,
  ) {
    super(players, roundDurationMs, () => {
      this.onRoundEnd();
    });

    this.maxRounds = maxRounds;
    this.onTimeout = onTimeout;

    this.roundSummaryTimer = new Timer(roundSummaryDurationMs, () => {
      this.onRoundSummaryEnd();
    });
  }

  public getSummaryTimer() {
    return this.roundSummaryTimer;
  }

  protected onRoundEnd() {
    this.onTimeout('SHOW_RESULT');
    this.roundSummaryTimer.start();
  }

  private onRoundSummaryEnd() {
    this.players.forEach((player: Player) => {
      player.setSelectedItem(-100);
    });

    if (this.round >= this.maxRounds) {
      this.onTimeout('END_GAME');
      this.end();
      return;
    }

    this.round++;
    this.onTimeout('NEXT_ROUND');
    this.roundSummaryTimer.clear();
    this.timer.clear();
    this.onNextRound(this.round);
  }

  public getGameData() {}

  public getRound() {
    return this.round;
  }

  abstract onNextRound(round: number): void;

  protected beforeStart() {}
}
