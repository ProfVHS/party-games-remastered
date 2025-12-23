import { TurnBasedMinigame } from './TurnBasedMinigame';
import { Room } from '../Room';
import { MinigameDataType } from '@shared/types';
import { CLICK_THE_BOMB_RULES } from '@shared/constants/gameRules';

const POINTS = CLICK_THE_BOMB_RULES.POINTS;

export class ClickTheBomb extends TurnBasedMinigame {
  private clickCount: number = 0;
  private maxClicks: number = 0;
  private streak: number = 0;
  private prizePool: number = 0;

  constructor(roomInstance: Room, config: MinigameDataType) {
    super(roomInstance, config);
  }

  private setupBomb = () => {
    this.clickCount = 0;
    this.maxClicks = Math.floor(Math.random() * (this.alivePlayersCount() * 4)) + 1;
    this.streak = 0;
    this.prizePool = 0;
  };

  private explode = () => {
    const player = this.getCurrentTurnPlayer();
    player.isAlive = false;

    if (this.isLastPlayerStanding()) {
      return { success: true, state: 'END_GAME' };
    }

    this.nextTurn();
    this.setupBomb();
  };

  private incrementCounter = () => {
    this.clickCount++;
    this.streak++;

    const prizePoolDelta = this.streak > POINTS.length - 1 ? POINTS.at(-1) || 0 : POINTS[this.streak - 1];
    this.prizePool += prizePoolDelta;
  };

  public click = () => {
    if (this.maxClicks === this.clickCount) return this.explode();

    this.incrementCounter();
    return { success: true, state: 'INCREMENTED' };
  };

  end(): void {
    // Logic after ending click the bomb
  }
}
