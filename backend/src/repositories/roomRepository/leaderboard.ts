import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { LeaderboardDataType } from '../../types/roomRepositoryTypes';

/**
 * If player DOESN'T EXIST, it ADDS the player to the leaderboard.
 * If player EXISTS, it UPDATES the player data in the leaderboard.
 * WITHOUT a leaderboardData object as parameter, it sets the player with DEFAULT DATA.
 * WITH a leaderboardData object, it sets the player with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param leaderboardData - (OPTIONAL)
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function setPlayerInLeaderboard(roomCode: string, playerID: string): Promise<void>;

/**
 * If player DOESN'T EXIST, it ADDS the player to the leaderboard.
 * If player EXISTS, it UPDATES the player data in the leaderboard.
 * WITHOUT a leaderboardData object as parameter, it sets the player with DEFAULT DATA.
 * WITH a leaderboardData object, it sets the player with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param leaderboardData - (OPTIONAL)
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function setPlayerInLeaderboard(roomCode: string, playerID: string, multi: ChainableCommander): Promise<void>;

/**
 * If player DOESN'T EXIST, it ADDS the player to the leaderboard.
 * If player EXISTS, it UPDATES the player data in the leaderboard.
 * WITHOUT a leaderboardData object as parameter, it sets the player with DEFAULT DATA.
 * WITH a leaderboardData object, it sets the player with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param leaderboardData - Leaderboard data object of format: { points?: number }
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function setPlayerInLeaderboard(roomCode: string, playerID: string, leaderboardData: LeaderboardDataType): Promise<void>;

/**
 * If player DOESN'T EXIST, it ADDS the player to the leaderboard.
 * If player EXISTS, it UPDATES the player data in the leaderboard.
 * WITHOUT a leaderboardData object as parameter, it sets the player with DEFAULT DATA.
 * WITH a leaderboardData object, it sets the player with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param leaderboardData - Leaderboard data object of format: { points?: number }
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function setPlayerInLeaderboard(
  roomCode: string,
  playerID: string,
  leaderboardData: LeaderboardDataType,
  multi: ChainableCommander,
): Promise<void>;

export async function setPlayerInLeaderboard(
  roomCode: string,
  playerID: string,
  arg3?: LeaderboardDataType | ChainableCommander,
  arg4?: ChainableCommander,
): Promise<void> {
  const leaderboardKey = `room:${roomCode}:leaderboard`;
  const defaultLeaderboardData: LeaderboardDataType = { points: 0 };

  let leaderboardData: LeaderboardDataType;
  let multi: ChainableCommander | undefined;

  if (arg3 && typeof arg3 === 'object' && !Array.isArray(arg3) && 'points' in arg3) {
    leaderboardData = { ...defaultLeaderboardData, ...arg3 };
    multi = arg4;
  } else {
    leaderboardData = defaultLeaderboardData;
    multi = arg3 as ChainableCommander | undefined;
  }

  if (multi) {
    multi.zadd(leaderboardKey, leaderboardData.points, playerID);
  } else {
    await client.zadd(leaderboardKey, leaderboardData.points, playerID);
  }
}

/**
 * Gets all players in the leaderboard with their data
 * @param roomCode - The unique identifier for the room.
 * @returns A promise that resolves to an array of objects containing nicknames and points of all players in the leaderboard or null if leaderboard is empty.
 * @example output: [{ id: 'BJHSDFG27346', points: 100 }, { id: 'IAYGSDGTAYSFD35235', points: 50 }]
 * @example output: null
 */

export async function getAllPlayersFromLeaderboard(roomCode: string): Promise<{ id: string; points: number }[] | null> {
  const leaderboardKey = `room:${roomCode}:leaderboard`;
  const leaderboardData = await client.zrevrange(leaderboardKey, 0, -1, 'WITHSCORES');

  if (leaderboardData.length === 0) {
    return null;
  }

  const players: { id: string; points: number }[] = [];

  for (let i = 0; i < leaderboardData.length; i += 2) {
    players.push({ id: leaderboardData[i], points: parseInt(leaderboardData[i + 1]) });
  }

  return players;
}

/**
 * Gets score of a player from leaderboard
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @returns A promise that resolves to the number of points of the player or null if player doesn't exist.
 * @example output: { points: 100 }
 * @example output: null
 */
export async function getPlayerScoreFromLeaderboard(roomCode: string, playerID: string): Promise<number | null> {
  const leaderboardKey = `room:${roomCode}:leaderboard`;
  const playerScore = await client.zscore(leaderboardKey, playerID);
  return playerScore ? parseInt(playerScore) : null;
}

/**
 * Removes a player from leaderboard
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function removePlayerFromLeaderboard(roomCode: string, playerID: string): Promise<void>;

/**
 * Removes a player from leaderboard
 * @param roomCode - The unique identifier for the room.
 * @param playerID - The unique identifier for the player.
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function removePlayerFromLeaderboard(roomCode: string, playerID: string, multi: ChainableCommander): Promise<void>;

export async function removePlayerFromLeaderboard(roomCode: string, playerID: string, multi?: ChainableCommander): Promise<void> {
  const leaderboardKey = `room:${roomCode}:leaderboard`;

  if (multi) {
    multi.zrem(leaderboardKey, playerID);
  } else {
    await client.zrem(leaderboardKey, playerID);
  }
}

/**
 * Deletes the leaderboard of the room.
 * @param roomCode - The unique identifier for the room.
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function deleteLeaderboard(roomCode: string): Promise<void>;

/**
 * Deletes the leaderboard of the room.
 * @param roomCode - The unique identifier for the room.
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function deleteLeaderboard(roomCode: string, multi: ChainableCommander): Promise<void>;

export async function deleteLeaderboard(roomCode: string, multi?: ChainableCommander): Promise<void> {
  const leaderboardKey = `room:${roomCode}:leaderboard`;

  if (multi) {
    multi.del(leaderboardKey);
  } else {
    await client.del(leaderboardKey);
  }
}
