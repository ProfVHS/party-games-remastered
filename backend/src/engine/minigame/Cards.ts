import { RoundBasedMinigame } from './base/RoundBasedMinigame';
import { Player } from '@engine/core/Player';
import _ from 'lodash';
import { RoundBaseTimeoutState } from '@backend-types';

const ROUND_CARDS: Record<number, number[]> = {
  1: [-30, -15, 25, 25, 30, 50, 60],
  2: [-50, -30, -15, 50, 50, 70, 90],
  3: [-90, -70, -40, -40, 50, 90, 120],
};

const COUNTDOWN_MS = 10000;
const COUNTDOWN_SUMMARY_MS = 8000;
const MAX_ROUNDS = 3;
const MIN_CARDS = 3;

export class Cards extends RoundBasedMinigame {
  private cards: number[] | null = null;

  constructor(players: Map<string, Player>, onTimeout: (state: RoundBaseTimeoutState) => void) {
    super(players, COUNTDOWN_MS, COUNTDOWN_SUMMARY_MS, MAX_ROUNDS, onTimeout);
  }

  public getGameData() {
    return this.cards;
  }

  private awardPoints() {
    if (!this.cards) return;

    this.getPlayersWithoutSelectedItem().forEach((player: Player) => {
      player.setSelectedItem(Math.floor(Math.random() * this.cards!.length - 1));
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
    const targetCardsCount = Math.max(MIN_CARDS, this.players.size - 1);
    const roundCards = ROUND_CARDS[round];

    const result = [];

    for (let i = 0; i < targetCardsCount; i++) {
      const index = Math.floor(i * roundCards.length / targetCardsCount);
      result.push(roundCards[index]);
    }

    this.cards = _.shuffle(result);
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
