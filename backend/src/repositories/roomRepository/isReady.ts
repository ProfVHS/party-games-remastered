import { ChainableCommander } from 'ioredis';
import { client } from '../../config/db';

/**
 * Sets the player's ready status in the room.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param isReady - Whether the player is ready.
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function setPlayerReady(roomCode: string, playerID: string, isReady: boolean): Promise<void>;
/**
 * Sets the player's ready status in the room.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param isReady - Whether the player is ready.
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function setPlayerReady(roomCode: string, playerID: string, isReady: boolean, multi: ChainableCommander): Promise<void>;

export async function setPlayerReady(roomCode: string, playerID: string, isReady: boolean, multi?: ChainableCommander): Promise<void> {
  const readySetKey = `room:${roomCode}:readyPlayers`;

  if (multi) {
    if (isReady) {
      multi.sadd(readySetKey, playerID);
    } else {
      multi.srem(readySetKey, playerID);
    }
  } else {
    if (isReady) {
      await client.sadd(readySetKey, playerID);
    } else {
      await client.srem(readySetKey, playerID);
    }
  }
}

/**
 * Gets all players who are ready in the room.
 * @param roomCode - The unique identifier for the room.
 * @returns A promise that resolves to an array of strings containing socket IDs of all players that are ready.
 * @example output: ['SIDBFYS67GYF', 'BISAFD7675', 'ISUDF5SDF689']
 * These 3 players are ready
 */
export async function getAllReadyPlayers(roomCode: string): Promise<string[]> {
  const readySetKey = `room:${roomCode}:readyPlayers`;
  return await client.smembers(readySetKey);
}

/**
 * Gets the number of players who are ready in the room.
 * @param roomCode - The unique identifier for the room.
 * @returns A promise that resolves to a number of players who are ready
 * @example output: 3
 * Meaning 3 players are ready
 */
export async function getAllReadyPlayerCount(roomCode: string): Promise<number> {
  const readySetKey = `room:${roomCode}:readyPlayers`;
  return await client.scard(readySetKey);
}

/**
 * Check whether the player is ready or not in the room.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @returns A promise that resolves to 1 if the player is ready, 0 otherwise.
 * @example output: 1
 * player is ready
 * @example output: 0
 * player is not ready
 */
export async function isPlayerReady(roomCode: string, playerID: string): Promise<number> {
  const readySetKey = `room:${roomCode}:readyPlayers`;
  return await client.sismember(readySetKey, playerID);
}

/**
 * Removes a player from the ready set in the room.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function removePlayerFromReady(roomCode: string, playerID: string): Promise<void>;

/**
 * Removes a player from the ready set in the room.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function removePlayerFromReady(roomCode: string, playerID: string, multi: ChainableCommander): Promise<void>;

export async function removePlayerFromReady(roomCode: string, playerID: string, multi?: ChainableCommander): Promise<void> {
  const readySetKey = `room:${roomCode}:readyPlayers`;

  if (multi) {
    multi.srem(readySetKey, playerID);
  } else {
    await client.srem(readySetKey, playerID);
  }
}

/**
 * Deletes the ready set of the room.
 * @param roomCode - The unique identifier for the room.
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function deleteIsReady(roomCode: string): Promise<void>;

/**
 * Deletes the ready set of the room.
 * @param roomCode - The unique identifier for the room.
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function deleteIsReady(roomCode: string, multi: ChainableCommander): Promise<void>;

export async function deleteIsReady(roomCode: string, multi?: ChainableCommander): Promise<void> {
  const readySetKey = `room:${roomCode}:readyPlayers`;

  if (multi) {
    multi.del(readySetKey);
  } else {
    await client.del(readySetKey);
  }
}
