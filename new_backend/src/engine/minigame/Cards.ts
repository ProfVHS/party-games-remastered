import { RoundBasedMinigame } from './base/RoundBasedMinigame';
import { Player } from '../core/Player';
import { CARDS_RULES } from '@shared/constants/gameRules';
import _ from 'lodash';

const MAX_RULES = 3;

const ROUND_CARDS: Record<number, number[]> = {
  1: CARDS_RULES.ROUND_1,
  2: CARDS_RULES.ROUND_2,
  3: CARDS_RULES.ROUND_3,
};

export class Cards extends RoundBasedMinigame {
  private cards: number[] | null = null;
  private playerChoices: Map<string, number> = new Map();

  constructor(players: Map<string, Player>) {
    super(players, MAX_RULES);
  }

  public shuffleCards = (round: number) => {
    this.cards = _.shuffle(ROUND_CARDS[round]);
  };

  public selectCard = (playerId: string, cardId: number) => {
    this.playerChoices.set(playerId, cardId);
  };

  onNextRound(round: number) {
    this.shuffleCards(round);
  }

  start() {
    this.shuffleCards(this.round);
  }
}
