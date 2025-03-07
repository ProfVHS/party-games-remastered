import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { IMinigameData, EPossibleStates, EPossibleMinigames } from '../../interfaces/roomRepositoryInterfaces';

/**
 * Sets the minigame data in the room.
 * @param roomCode - The unique identifier for the room.
 * @param minigameData - The minigame data.
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function setMinigame(roomCode: string, minigameData: IMinigameData): Promise<void>;

/**
 * Sets the minigame data in the room.
 * @param roomCode - The unique identifier for the room.
 * @param minigameData - The minigame data.
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function setMinigame(roomCode: string, minigameData: IMinigameData, multi: ChainableCommander): Promise<void>;

export async function setMinigame(roomCode: string, minigameData: IMinigameData, multi?: ChainableCommander): Promise<void> {
  const minigameKey = `room:${roomCode}:minigame`;

  const redisData = {
    ...minigameData,
    customData: JSON.stringify(minigameData.customData),
  };

  if (multi) {
    multi.hset(minigameKey, redisData);
  } else {
    await client.hset(minigameKey, redisData);
  }
}

/**
 *
 * @param roomCode - The unique identifier for the room.
 * @returns A promise that resolves to the minigame data or null if there is no minigame running.
 * @example { minigame: 'Click the Bomb', state: 'playing', turns: 3, currentTurn: 1, timeForTurn: 10, customData: { maxClicks: 5 } }
 */
export async function getMinigame(roomCode: string): Promise<IMinigameData | null> {
  const minigameKey = `room:${roomCode}:minigame`;
  const rawData = await client.hgetall(minigameKey);

  if (!rawData || Object.keys(rawData).length === 0) return null;

  return {
    minigame: rawData.minigame as EPossibleMinigames,
    state: rawData.state as EPossibleStates,
    rounds: Number(rawData.turns),
    currentRound: Number(rawData.currentTurn),
    timeForTurn: Number(rawData.timeForTurn),
    customData: JSON.parse(rawData.customData),
  };
}
