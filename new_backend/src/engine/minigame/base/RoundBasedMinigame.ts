import { BaseMinigame } from './BaseMinigame';
import { Player } from '../../core/Player';
import { Timer } from '../../core/Timer';

export abstract class RoundBasedMinigame extends BaseMinigame {
  protected round: number = 1;
  private readonly maxRounds: number;
  private roundSummaryTimer: Timer;

  protected constructor(
    players: Map<string, Player>,
    roundDuration: number,
    roundSummaryDuration: number,
    maxRounds: number,
    onRoundEnd: () => void,
    onRoundSummaryEnd: () => void,
  ) {
    super(players, roundDuration, onRoundEnd);

    this.maxRounds = maxRounds;
    this.roundSummaryTimer = new Timer(roundSummaryDuration, () => {
      onRoundSummaryEnd();
      this.onRoundSummaryEnd();
    });
  }

  protected onTimerEnd = () => {
    this.roundSummaryTimer.start();
  };

  private onRoundSummaryEnd = () => {
    if (this.maxRounds === this.round) {
      this.end();
      return { success: true, status: 'END_GAME' };
    }

    const newRound = this.round++;
    this.onNextRound(newRound);
    return newRound;
  };

  public getRound() {
    return this.round;
  }

  abstract onNextRound(round: number): void;
}
