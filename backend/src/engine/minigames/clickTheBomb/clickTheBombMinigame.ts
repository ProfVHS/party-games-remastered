import { TurnBasedMinigame } from '../../turnBasedMinigame';
import { ChainableCommander } from 'ioredis';
import { createClickTheBombConfig } from '@config/minigames';
import * as roomRepository from '@roomRepository';
import { getAllPlayers, getMinigameData, setMinigameData, updateMinigameData, updatePlayerScore } from '@roomRepository';
import { MinigameDataType, MinigameNamesEnum, PlayerStatusEnum, PlayerType } from '@shared/types';
import { NotFoundError, UnprocessableEntityError } from '@errors';
import { findAlivePlayersService, syncPlayerScoreService, syncPlayerUpdateService } from '@playerService';
import { CLICK_THE_BOMB_RULES } from '@shared/constants/gameRules';
import { ClickTheBombEvent } from './types';

const POINTS = CLICK_THE_BOMB_RULES.POINTS;
const LOSS = CLICK_THE_BOMB_RULES.LOSS;

export class ClickTheBombMinigame extends TurnBasedMinigame {
  async start(multi: ChainableCommander) {
    await this.init();
    const config = createClickTheBombConfig(this.playersCount);

    console.log(`Starting Click The Bomb minigame in room ${this.roomCode} with config:`, config);
    await roomRepository.setMinigameData(this.roomCode, config, multi);

    return config;
  }

  async bombClick(playerId: string, countdownExpired: boolean): Promise<ClickTheBombEvent> {
    const minigame: MinigameDataType | null = await getMinigameData(this.roomCode);
    const players: PlayerType[] | null = await getAllPlayers(this.roomCode);

    if (!minigame) throw new NotFoundError('Minigame', this.roomCode);

    if (minigame.minigameName != MinigameNamesEnum.clickTheBomb) {
      throw new UnprocessableEntityError('minigame type', 'Click the Bomb', minigame.minigameName);
    }

    if (!players) throw new NotFoundError('Players', this.roomCode);

    let newClickCount = minigame.clickCount + 1;
    const currentPlayer = players.find((p) => p.id === playerId);
    if (!currentPlayer) throw new NotFoundError('Player', this.roomCode);

    let newStreak = minigame.streak + 1;
    const prizePoolDelta = newStreak > POINTS.length - 1 ? POINTS.at(-1) || 0 : POINTS[newStreak - 1];
    const newPrizePool = minigame.prizePool + prizePoolDelta;

    if (minigame.maxClicks === newClickCount || countdownExpired) {
      return await this.handlePlayerExplosion(currentPlayer, players);
    } else {
      await updateMinigameData(this.roomCode, {
        clickCount: newClickCount,
        streak: newStreak,
        prizePool: newPrizePool,
      });
      return { type: 'CLICK_UPDATED', prizePool: newPrizePool, clickCount: newClickCount, prizePoolDelta };
    }
  }

  async resetStreak() {
    await updateMinigameData(this.roomCode, { streak: 0, prizePool: 0 });
  }

  async grantPrizePool(playerId: string) {
    const minigame = await getMinigameData(this.roomCode);

    if (!minigame) throw new NotFoundError('Minigame', this.roomCode);
    if (minigame.minigameName != MinigameNamesEnum.clickTheBomb) throw new UnprocessableEntityError('minigame type', 'Click the Bomb', minigame.minigameName);

    await updatePlayerScore(this.roomCode, playerId, minigame.prizePool);
  }

  private async handlePlayerExplosion(currentPlayer: PlayerType, players: PlayerType[]): Promise<ClickTheBombEvent> {
    const alivePlayers = await findAlivePlayersService(players);

    await syncPlayerUpdateService(this.roomCode, currentPlayer, { isAlive: false, status: PlayerStatusEnum.dead });
    await syncPlayerScoreService(this.roomCode, currentPlayer, LOSS);

    if (alivePlayers && alivePlayers.length <= 2) {
      await this.end();
      return { type: 'GAME_ENDED', players: players };
    }

    const newTurnData = await this.nextTurn();
    const newConfig = createClickTheBombConfig(alivePlayers!.length);

    await setMinigameData(this.roomCode, newConfig);

    return {
      type: 'PLAYER_EXPLODED',
      turnData: newTurnData,
    };
  }
}
