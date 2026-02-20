import { RoundBasedMinigame } from '@minigame-base/RoundBasedMinigame';
import { Player } from '@engine/core/Player';
import { RoundBaseTimeoutState } from '@backend-types';
import { TRICKY_DIAMONDS_RULES } from '@shared/constants/gameRules';
import { DiamondType } from '@shared/types';

const ROUND_DIAMONDS: Record<number, number[]> = {
  1: TRICKY_DIAMONDS_RULES.ROUND_1,
  2: TRICKY_DIAMONDS_RULES.ROUND_2,
  3: TRICKY_DIAMONDS_RULES.ROUND_3,
};

export class TrickyDiamonds extends RoundBasedMinigame {
  private diamonds: number[] | null = null;
  private diamondStats: DiamondType[] | null = null;

  constructor(players: Map<string, Player>, onTimeout: (state: RoundBaseTimeoutState) => void) {
    super(players, TRICKY_DIAMONDS_RULES.COUNTDOWN_MS, TRICKY_DIAMONDS_RULES.COUNTDOWN_SUMMARY_MS, TRICKY_DIAMONDS_RULES.MAX_ROUNDS, onTimeout);
  }

  public getGameData() {
    return this.diamondStats;
  }

  private awardPoints() {
    if (!this.diamonds) return;

    const players = this.getPlayers();
    const playersWithoutCard = players.filter((player: Player) => player.getSelectedItem() === -100);

    playersWithoutCard.forEach((player: Player) => {
      player.setSelectedItem(Math.floor(Math.random() * 3));
    });

    this.diamondStats = [0, 1, 2].map((id) => {
      const playersForDiamond = players.filter((p) => p.isAlive() && !p.isDisconnected() && p.getSelectedItem() === id).map((p) => p.nickname);
      return { id, players: playersForDiamond, won: false };
    });

    const selectedDiamonds = this.diamondStats.filter((d) => d.players.length > 0);

    const minCount = Math.min(...selectedDiamonds.map((d) => d.players.length));
    const maxCount = Math.max(...selectedDiamonds.map((d) => d.players.length));

    const diamondsWithMinCount = selectedDiamonds.filter((d) => d.players.length === minCount);

    // There is diamond with unique minimum value
    if (diamondsWithMinCount.length === 1 && minCount !== maxCount) {
      const diamondWinnerId = diamondsWithMinCount[0].id;

      this.diamondStats[diamondWinnerId].won = true;

      players.map(async (player) => {
        if (player.getSelectedItem() === diamondWinnerId) {
          player.addScore(ROUND_DIAMONDS[this.round][diamondWinnerId]);
        }
      });
    }
  }

  protected onTimerEnd() {
    this.awardPoints();
    super.onTimerEnd();
  }

  onNextRound() {
    this.diamonds = ROUND_DIAMONDS[this.round];
  }

  override start() {
    super.start();
    this.diamonds = ROUND_DIAMONDS[this.round];
  }

  end() {}
}
