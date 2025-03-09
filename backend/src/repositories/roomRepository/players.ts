import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { TPlayerData, TPlayer } from '../../types/roomRepositoryTypes';
import { Socket } from 'socket.io';

/**
 * If player DOESN'T EXIST, it ADDS the player.
 * If player EXISTS, it UPDATES the player data.
 * WITHOUT a playerData object as parameter, it sets the player with DEFAULT DATA.
 * WITH a playerData object, it sets the player with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param nickname - The nickname of the player.
 * @param playerData - (OPTIONAL)
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function setPlayerInPlayers(roomCode: string, playerID: string, nickname: string): Promise<void>;
/**
 * If player DOESN'T EXIST, it ADDS the player.
 * If player EXISTS, it UPDATES the player data.
 * WITHOUT a playerData object as parameter, it sets the player with DEFAULT DATA.
 * WITH a playerData object, it sets the player with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param nickname - The nickname of the player.
 * @param playerData - (OPTIONAL)
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function setPlayerInPlayers(roomCode: string, playerID: string, nickname: string, multi: ChainableCommander): Promise<void>;
/**
 * If player DOESN'T EXIST, it ADDS the player.
 * If player EXISTS, it UPDATES the player data.
 * WITHOUT a playerData object as parameter, it sets the player with DEFAULT DATA.
 * WITH a playerData object, it sets the player with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param nickname - The nickname of the player.
 * @param playerData - Player data object of format: { points?: number, isAlive?: boolean }
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function setPlayerInPlayers(roomCode: string, playerID: string, nickname: string, playerData: TPlayerData): Promise<void>;
/**
 * If player DOESN'T EXIST, it ADDS the player.
 * If player EXISTS, it UPDATES the player data.
 * WITHOUT a playerData object as parameter, it sets the player with DEFAULT DATA.
 * WITH a playerData object, it sets the player with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param nickname - The nickname of the player.
 * @param playerData - Player data object of format: { points?: number, isAlive?: boolean }
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function setPlayerInPlayers(roomCode: string, playerID: string, nickname: string, playerData: TPlayerData, multi: ChainableCommander): Promise<void>;

export async function setPlayerInPlayers(roomCode: string, playerID: string, nickname: string, arg4?: TPlayerData | ChainableCommander, arg5?: ChainableCommander): Promise<void> {
  const playersKey = `room:${roomCode}:players`;
  const defaultPlayerData: TPlayerData = { nickname: nickname, points: 0, isAlive: true };

  let playerData: TPlayerData;
  let multi: ChainableCommander | undefined;

  if (arg4 && typeof arg4 === 'object' && !Array.isArray(arg4) && ('points' in arg4 || 'isAlive' in arg4)) {
    playerData = { ...defaultPlayerData, ...arg4 };
    multi = arg5;
  } else {
    playerData = defaultPlayerData;
    multi = arg4 as ChainableCommander | undefined;
  }

  if (multi) {
    multi.hset(playersKey, playerID, JSON.stringify(playerData));
  } else {
    await client.hset(playersKey, playerID, JSON.stringify(playerData));
  }
}

/**
 * Gets all players in the room.
 * @param roomCode - The unique identifier for the room.
 * @returns A promise that resolves to an array of objects containing nickname and data of all players or null if there are no players.
 * @example output: [{ id: 'UJBLISUygy7t565sf', data: { nickname: 'John', points: 0, isAlive: true } }, { id: 'LIsjbclyiqld6785', data: { nickname: 'Sam', points: 0, isAlive: true } }]
 * @example output: null
 */
export async function getAllPlayersFromPlayers(roomCode: string): Promise<TPlayer[] | null> {
  const playersKey = `room:${roomCode}:players`;

  const rawPlayers = await client.hgetall(playersKey);

  if (Object.keys(rawPlayers).length === 0) {
    return null;
  }

  const parsedPlayers: TPlayer[] = [];

  for (const [id, playerData] of Object.entries(rawPlayers)) {
    parsedPlayers.push({ id, data: JSON.parse(playerData) });
  }

  return parsedPlayers;
}

/**
 * Gets a player in the room.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @returns A promise that resolves to an object containing socket ID and data of the player or null if player doesn't exist.
 * @example output: { id: 'UIQOENFI76f5f', data: { nickname: 'John', points: 0, isAlive: true } }
 * @example output: null
 */
export async function getPlayerFromPlayers(roomCode: string, playerID: string): Promise<TPlayer | null> {
  const playersKey = `room:${roomCode}:players`;

  const rawPlayer = await client.hget(playersKey, playerID);

  if (!rawPlayer) {
    return null;
  }

  return { id: playerID, data: JSON.parse(rawPlayer) };
}

/**
 * Removes a player from the room.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function removePlayerFromPlayers(roomCode: string, playerID: string): Promise<void>;

/**
 * Removes a player from the room.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function removePlayerFromPlayers(roomCode: string, playerID: string, multi: ChainableCommander): Promise<void>;

export async function removePlayerFromPlayers(roomCode: string, playerID: string, multi?: ChainableCommander): Promise<void> {
  const playersKey = `room:${roomCode}:players`;

  if (multi) {
    multi.hdel(playersKey, playerID);
  } else {
    await client.hdel(playersKey, playerID);
  }
}

/**
 * Deletes all players in the room.
 * @param roomCode - The unique identifier for the room.
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function deletePlayers(roomCode: string): Promise<void>;

/**
 * Deletes all players in the room.
 * @param roomCode - The unique identifier for the room.
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function deletePlayers(roomCode: string, multi: ChainableCommander): Promise<void>;

export async function deletePlayers(roomCode: string, multi?: ChainableCommander): Promise<void> {
  const playersKey = `room:${roomCode}:players`;

  if (multi) {
    multi.del(playersKey);
  } else {
    await client.del(playersKey);
  }
}

/**
 * Finds the room code where a player is currently present.
 * @param playerID - The socket ID of the player.
 * @returns A promise that resolves to the room code if found, otherwise null.
 * @example output: 'ABCDE'
 * @example output: null
 */
export async function getRoomCodeFromPlayer(playerID: string): Promise<string | null> {
  const roomKeysPattern = 'room:*:players';
  const roomKeys = await client.keys(roomKeysPattern);

  for (const roomKey of roomKeys) {
    const exists = await client.hexists(roomKey, playerID);
    if (exists) {
      return roomKey.split(':')[1]; // Extracting the roomCode from the key
    }
  }

  return null;
}
