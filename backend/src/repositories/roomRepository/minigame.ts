import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { MinigameDataType } from '../../types/roomRepositoryTypes';

/**
 * Sets the minigame data in the room.
 * @param roomCode - The unique identifier for the room.
 * @param minigameData - The minigame data.
 * @param multi - (OPTIONAL) Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */

export async function setMinigame(roomCode: string, minigameData: MinigameDataType, multi?: ChainableCommander): Promise<void> {
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
 * @returns A promise that resolves to the minigame data.
 * @example { minigame: "Click the Bomb", state: "playing", rounds: 3, currentRound: 1, timeForTurn: 10, currentMinigameData: { ... } }
 */
export async function getMinigame(roomCode: string): Promise<MinigameDataType | null> {
  const minigameKey = `room:${roomCode}:minigame`;
  const data = await client.hget(minigameKey, 'minigameData');

  if (!data) return null;

  return JSON.parse(data);
}
