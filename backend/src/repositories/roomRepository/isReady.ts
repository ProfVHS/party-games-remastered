import { ChainableCommander } from 'ioredis';
import { client } from '../../config/db';

/**
 * Sets the player's ready status in the room.
 * @param roomCode - The unique identifier for the room.
 * @param nickname - The player's nickname.
 * @param isReady - Whether the player is ready.
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function setPlayerReady(roomCode: string, nickname: string, isReady: boolean): Promise<void>;
/**
 * Sets the player's ready status in the room.
 * @param roomCode - The unique identifier for the room.
 * @param nickname - The player's nickname.
 * @param isReady - Whether the player is ready.
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function setPlayerReady(roomCode: string, nickname: string, isReady: boolean, multi: ChainableCommander): Promise<void>;

export async function setPlayerReady(roomCode: string, nickname: string, isReady: boolean, multi?: ChainableCommander): Promise<void> {
  const readySetKey = `room:${roomCode}:readyPlayers`;

  if (multi) {
    if (isReady) {
      multi.sadd(readySetKey, nickname);
    } else {
      multi.srem(readySetKey, nickname);
    }
  } else {
    if (isReady) {
      await client.sadd(readySetKey, nickname);
    } else {
      await client.srem(readySetKey, nickname);
    }
  }
}

/**
 * Gets all players who are ready in the room.
 * @param roomCode - The unique identifier for the room.
 * @returns A promise that resolves to an array of strings containing nicknames of all players that are ready.
 * @example output: ['John', 'Sam', 'Jeff']
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
 * @param nickname - The player's nickname.
 * @returns A promise that resolves to 1 if the player is ready, 0 otherwise.
 * @example output: 1
 * player is ready
 * @example output: 0
 * player is not ready
 */
export async function isPlayerReady(roomCode: string, nickname: string): Promise<number> {
  const readySetKey = `room:${roomCode}:readyPlayers`;
  return await client.sismember(readySetKey, nickname);
}

/**
 * Removes a player from the ready set in the room.
 * @param roomCode - The unique identifier for the room.
 * @param nickname - The player's nickname.
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function removePlayerFromReady(roomCode: string, nickname: string): Promise<void>;

/**
 * Removes a player from the ready set in the room.
 * @param roomCode - The unique identifier for the room.
 * @param nickname - The player's nickname.
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function removePlayerFromReady(roomCode: string, nickname: string, multi: ChainableCommander): Promise<void>;

export async function removePlayerFromReady(roomCode: string, nickname: string, multi?: ChainableCommander): Promise<void> {
  const readySetKey = `room:${roomCode}:readyPlayers`;

  if (multi) {
    multi.srem(readySetKey, nickname);
  } else {
    await client.srem(readySetKey, nickname);
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
