import { BaseMinigame } from './BaseMinigame';
import { Player } from '@engine/core/Player';
import { Timer } from '@engine/core/Timer';
import { RoundBaseTimeoutState } from '@backend-types';

export abstract class RoundBasedMinigame extends BaseMinigame {
  protected round: number = 1;
  private readonly maxRounds: number;
  private readonly roundSummaryTimer: Timer;
  private readonly onTimeout: (state: RoundBaseTimeoutState) => void;

  protected constructor(
    players: Map<string, Player>,
    roundDurationMs: number,
    roundSummaryDurationMs: number,
    maxRounds: number,
    onTimeout: (state: RoundBaseTimeoutState) => void,
  ) {
    super(players, roundDurationMs, () => {
      this.onTimerEnd();
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

  protected onTimerEnd() {
    this.onTimeout({ success: true, state: 'SHOW_RESULT' });
    this.roundSummaryTimer.start();
  }

  private onRoundSummaryEnd() {
    this.players.forEach((player: Player) => {
      player.setSelectedItem(null);
    });

    if (this.round >= this.maxRounds) {
      this.onTimeout({ success: true, state: 'END_GAME' });

      this.end();
      return;
    }

    this.round++;
    this.onTimeout({ success: true, state: 'NEXT_ROUND' });
    this.roundSummaryTimer.clear();
    this.timer.clear();
    this.onNextRound(this.round);
  }

  public getRound() {
    return this.round;
  }

  protected getPlayersWithSelectedItem(itemIndex: number) {
    return this.getPlayers().filter((player: Player) => player.getSelectedItem() === itemIndex);
  }

  protected getPlayersWithoutSelectedItem() {
    return this.getPlayers().filter((player: Player) => player.getSelectedItem() === null);
  }

  protected beforeStart() {}

  protected abstract onNextRound(round: number): void;

  public abstract getGameData(): void;

  public abstract getGameConfig(): number[];
}
