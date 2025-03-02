import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { IPlayerData, IPlayer } from '../../interfaces/roomRepositoryInterfaces';

/**
 * If player DOESN'T EXIST, it ADDS the player.
 * If player EXISTS, it UPDATES the player data.
 * WITHOUT a playerData object as parameter, it sets the player with DEFAULT DATA.
 * WITH a playerData object, it sets the player with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param nickname - The nickname of the player.
 * @param playerData - (OPTIONAL)
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function setPlayer(roomCode: string, nickname: string): Promise<void>;
/**
 * If player DOESN'T EXIST, it ADDS the player.
 * If player EXISTS, it UPDATES the player data.
 * WITHOUT a playerData object as parameter, it sets the player with DEFAULT DATA.
 * WITH a playerData object, it sets the player with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param nickname - The nickname of the player.
 * @param playerData - (OPTIONAL)
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function setPlayer(roomCode: string, nickname: string, multi: ChainableCommander): Promise<void>;
/**
 * If player DOESN'T EXIST, it ADDS the player.
 * If player EXISTS, it UPDATES the player data.
 * WITHOUT a playerData object as parameter, it sets the player with DEFAULT DATA.
 * WITH a playerData object, it sets the player with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param nickname - The nickname of the player.
 * @param playerData - Player data object of format: { points?: number, isAlive?: boolean }
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function setPlayer(roomCode: string, nickname: string, playerData: IPlayerData): Promise<void>;
/**
 * If player DOESN'T EXIST, it ADDS the player.
 * If player EXISTS, it UPDATES the player data.
 * WITHOUT a playerData object as parameter, it sets the player with DEFAULT DATA.
 * WITH a playerData object, it sets the player with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param nickname - The nickname of the player.
 * @param playerData - Player data object of format: { points?: number, isAlive?: boolean }
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function setPlayer(roomCode: string, nickname: string, playerData: IPlayerData, multi: ChainableCommander): Promise<void>;

export async function setPlayer(roomCode: string, nickname: string, arg3?: IPlayerData | ChainableCommander, arg4?: ChainableCommander): Promise<void> {
  const playersKey = `room:${roomCode}:players`;
  const defaultPlayerData: IPlayerData = { points: 0, isAlive: true };

  let playerData: IPlayerData;
  let multi: ChainableCommander | undefined;

  if (arg3 && typeof arg3 === 'object' && !Array.isArray(arg3) && ('points' in arg3 || 'isAlive' in arg3)) {
    playerData = { ...defaultPlayerData, ...arg3 };
    multi = arg4;
  } else {
    playerData = defaultPlayerData;
    multi = arg3 as ChainableCommander | undefined;
  }

  if (multi) {
    multi.hset(playersKey, nickname, JSON.stringify(playerData));
  } else {
    await client.hset(playersKey, nickname, JSON.stringify(playerData));
  }
}

/**
 * Gets all players in the room.
 * @param roomCode - The unique identifier for the room.
 * @returns A promise that resolves to an array of objects containing nickname and data of all players or null if there are no players.
 * @example output: [{ nickname: 'John', data: { points: 0, isAlive: true } }, { nickname: 'Sam', data: { points: 0, isAlive: true } }]
 * @example output: null
 */
export async function getAllPlayers(roomCode: string): Promise<IPlayer[] | null> {
  const playersKey = `room:${roomCode}:players`;

  const rawPlayers = await client.hgetall(playersKey);

  if (Object.keys(rawPlayers).length === 0) {
    return null;
  }

  const parsedPlayers: IPlayer[] = [];

  for (const [nickname, playerData] of Object.entries(rawPlayers)) {
    parsedPlayers.push({ nickname, data: JSON.parse(playerData) });
  }

  return parsedPlayers;
}

/**
 * Gets a player in the room.
 * @param roomCode - The unique identifier for the room.
 * @param nickname - The nickname of the player.
 * @returns A promise that resolves to an object containing nickname and data of the player.
 * @example output: { nickname: 'John', data: { points: 0, isAlive: true } }
 * @example output: null
 */
export async function getPlayer(roomCode: string, nickname: string): Promise<IPlayer | null> {
  const playersKey = `room:${roomCode}:players`;

  const rawPlayer = await client.hget(playersKey, nickname);

  if (!rawPlayer) {
    return null;
  }

  return { nickname, data: JSON.parse(rawPlayer) };
}

/**
 * Removes a player from the room.
 * @param roomCode - The unique identifier for the room.
 * @param nickname - The nickname of the player.
 * @returns A promise that resolves to void.
 */
export async function removePlayer(roomCode: string, nickname: string): Promise<void> {
  const playersKey = `room:${roomCode}:players`;
  await client.hdel(playersKey, nickname);
}
