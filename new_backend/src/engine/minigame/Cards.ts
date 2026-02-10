import { RoundBasedMinigame } from './base/RoundBasedMinigame';
import { Player } from '@engine/core/Player';
import { CARDS_RULES } from '@shared/constants/gameRules';
import _ from 'lodash';
import { RoundBaseTimeoutState } from '@backend-types';

const ROUND_CARDS: Record<number, number[]> = {
  1: CARDS_RULES.ROUND_1,
  2: CARDS_RULES.ROUND_2,
  3: CARDS_RULES.ROUND_3,
};

export class Cards extends RoundBasedMinigame {
  private cards: number[] | null = null;
  private playerChoices: Map<string, number> = new Map();

  constructor(players: Map<string, Player>, onTimeout: (state: RoundBaseTimeoutState) => void) {
    super(players, CARDS_RULES.COUNTDOWN_MS, CARDS_RULES.COUNTDOWN_SUMMARY_MS, CARDS_RULES.MAX_ROUNDS, onTimeout, 2000);
  }

  public getGameData() {
    return this.cards;
  }

  public shuffleCards = (round: number) => {
    this.cards = _.shuffle(ROUND_CARDS[round]);
  };

  public selectCard = (playerId: string, cardId: number) => {
    this.playerChoices.set(playerId, cardId);
  };

  protected onTimerEnd(): void {}

  onNextRound(round: number) {
    this.shuffleCards(round);
  }

  override start() {
    super.start();
    this.shuffleCards(this.round);
  }

  end() {}
}
