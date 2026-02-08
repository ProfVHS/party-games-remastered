import { BaseMinigame } from './BaseMinigame';
import { Player } from '../../core/Player';
import { Timer } from '../../core/Timer';
import { RoundBaseTimeoutState } from '../../../types/MinigameTypes';

export abstract class RoundBasedMinigame extends BaseMinigame {
  protected round: number = 1;
  private readonly maxRounds: number;
  private roundSummaryTimer: Timer;
  private onTimeout: (state: RoundBaseTimeoutState) => void;

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

  protected onRoundEnd() {
    this.onTimeout('SHOW_RESULT');
    this.roundSummaryTimer.start();
  }

  private onRoundSummaryEnd() {
    if (this.round >= this.maxRounds) {
      this.onTimeout('END_GAME');
      this.end();
      return;
    }

    this.round++;
    this.onTimeout('NEXT_ROUND');
    this.timer.reset();
    this.roundSummaryTimer.clear();
  }

  public getRound() {
    return this.round;
  }

  abstract onNextRound(round: number): void;

  protected beforeStart = () => {
    this.timer.start();
  };
}
