import { TurnBasedMinigame } from './TurnBasedMinigame';
import { MinigameDataType } from '@shared/types';
import { Player } from '../Player';

const POINTS = [15, 17, 20, 23, 26, 30, 35];
const LOSS = 50;

export class ClickTheBomb extends TurnBasedMinigame {
  public clickCount: number = 0;
  public streak: number = 0;
  public prizePool: number = 0;

  private maxClicks: number = 0;

  constructor(players: Map<string, Player>, config: MinigameDataType) {
    super(players, config);
  }

  private setupBomb = () => {
    this.clickCount = 0;
    this.maxClicks = Math.floor(Math.random() * (this.alivePlayersCount() * 4)) + 1;
    this.streak = 0;
    this.prizePool = 0;
  };

  private explode = () => {
    const player = this.getCurrentTurnPlayer();
    player.kill();
    player.substractScore(LOSS);

    if (this.isLastPlayerStanding()) {
      this.end();
      return { success: true, state: 'END_GAME' };
    }

    this.nextTurn();
    this.setupBomb();
    return { success: true, state: 'PLAYER_EXPLODED' };
  };

  private incrementCounter = () => {
    this.clickCount++;
    this.streak++;

    const prizePoolDelta = this.streak > POINTS.length - 1 ? POINTS.at(-1) || 0 : POINTS[this.streak - 1];
    this.prizePool += prizePoolDelta;
  };

  private grantPrizePool = () => {
    const currentPlayer = this.getCurrentTurnPlayer();
    currentPlayer.addScore(this.prizePool);

    this.prizePool = 0;
    this.streak = 0;
  };

  public click = () => {
    if (this.maxClicks === this.clickCount) return this.explode();

    this.incrementCounter();
    return { success: true, state: 'INCREMENTED' };
  };

  onNextTurn = () => {
    this.grantPrizePool();
  };

  start = () => {
    this.setupBomb();
  };

  end(): void {
    this.players.forEach((player: Player) => {
      player.revive();
    });
  }
}
