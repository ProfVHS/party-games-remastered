import { RoundBasedMinigame } from './base/RoundBasedMinigame';
import { Player } from '@engine/core/Player';
import _ from 'lodash';
import { RoundBaseTimeoutState } from '@backend-types';

const ROUND_CARDS: Record<number, number[]> = {
  1: [25, 25, 30, 50, 50, 60, -15, -15, -30],
  2: [50, 50, 50, 70, 90, -15, -30, -30, -50],
  3: [50, 90, 90, 120, -40, -40, -70, -70, -90],
};

const COUNTDOWN_MS = 10000;
const COUNTDOWN_SUMMARY_MS = 8000;
const MAX_ROUNDS = 3;

export class Cards extends RoundBasedMinigame {
  private cards: number[] | null = null;

  constructor(players: Map<string, Player>, onTimeout: (state: RoundBaseTimeoutState) => void) {
    super(players, COUNTDOWN_MS, COUNTDOWN_SUMMARY_MS, MAX_ROUNDS, onTimeout);
  }

  public getGameData() {
    let playersMap: Record<number, { id: string; nickname: string }[]> = {};
    const shuffledCards = this.cards;

    this.getPlayers().map((player) => {
      const cardIndex = player.getSelectedItem();

      if (cardIndex !== null) {
        if (!playersMap[cardIndex]) {
          playersMap[cardIndex] = [];
        }

        playersMap[cardIndex].push({ id: player.id, nickname: player.nickname });
      }
    });

    return { shuffledCards, playersMap };
  }

  private awardPoints() {
    if (!this.cards) return;

    this.getPlayersWithoutSelectedItem().forEach((player: Player) => {
      player.setSelectedItem(Math.floor(Math.random() * 9));
    });

    this.cards.forEach((card, index) => {
      const playersWithThisCard = this.getPlayersWithSelectedItem(index);

      playersWithThisCard.forEach((player: Player) => {
        const cardScore = card < 0 ? card * playersWithThisCard.length : card / playersWithThisCard.length;
        player.addScore(cardScore);
      });
    });
  }

  public shuffleCards(round: number) {
    this.cards = _.shuffle(ROUND_CARDS[round]);
  }

  protected onTimerEnd() {
    this.awardPoints();
    super.onTimerEnd();
  }

  onNextRound(round: number) {
    this.shuffleCards(round);
  }

  override start() {
    super.start();
    this.shuffleCards(this.round);
  }

  end() {}

  public getCountdownDuration(): number {
    return COUNTDOWN_MS;
  }

  public getGameConfig(): number[] {
    return [];
  }
}
