import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { TMinigameData, EPossibleStates, EPossibleMinigames } from '../../types/roomRepositoryTypes';

/**
 * Sets the minigame data in the room.
 * @param roomCode - The unique identifier for the room.
 * @param minigameData - The minigame data.
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function setMinigame(roomCode: string, minigameData: TMinigameData): Promise<void>;

/**
 * Sets the minigame data in the room.
 * @param roomCode - The unique identifier for the room.
 * @param minigameData - The minigame data.
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function setMinigame(roomCode: string, minigameData: TMinigameData, multi: ChainableCommander): Promise<void>;

export async function setMinigame(roomCode: string, minigameData: TMinigameData, multi?: ChainableCommander): Promise<void> {
  const minigameKey = `room:${roomCode}:minigame`;

  if (multi) {
    multi.hset(minigameKey, 'minigameData', JSON.stringify(minigameData));
  } else {
    await client.hset(minigameKey, 'minigameData', JSON.stringify(minigameData));
  }
}

/**
 *
 * @param roomCode - The unique identifier for the room.
 * @returns A promise that resolves to the minigame data or null if there is no minigame running.
 * @example { minigame: 'Click the Bomb', state: 'playing', turns: 3, currentTurn: 1, timeForTurn: 10, currentMinigameData: { maxClicks: 5 } }
 */
export async function getMinigame(roomCode: string): Promise<TMinigameData | null> {
  const minigameKey = `room:${roomCode}:minigame`;
  const data = await client.hget(minigameKey, 'minigameData');

  if (!data) return null;

  return JSON.parse(data);
}
