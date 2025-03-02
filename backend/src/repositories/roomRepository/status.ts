import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { EPossibleMinigames, EPossibleStates, IStatusData } from '../../interfaces/roomRepositoryInterfaces';

/**
 * If status DOESN'T EXIST, it ADDS the status.
 * If status EXISTS, it UPDATES the status data.
 * WITHOUT a statusData object as parameter, it sets the status with DEFAULT DATA.
 * WITH a statusData object, it sets the status with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param statusData - (OPTIONAL)
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function setRoomStatus(roomCode: string): Promise<void>;

/**
 * If status DOESN'T EXIST, it ADDS the status.
 * If status EXISTS, it UPDATES the status data.
 * WITHOUT a statusData object as parameter, it sets the status with DEFAULT DATA.
 * WITH a statusData object, it sets the status with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param statusData - (OPTIONAL)
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function setRoomStatus(roomCode: string, multi: ChainableCommander): Promise<void>;

/**
 * If status DOESN'T EXIST, it ADDS the status.
 * If status EXISTS, it UPDATES the status data.
 * WITHOUT a statusData object as parameter, it sets the status with DEFAULT DATA.
 * WITH a statusData object, it sets the status with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param statusData - Status data object of format: { minigame?: EPossibleMinigames, state?: EPossibleStates }
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function setRoomStatus(roomCode: string, statusData: IStatusData): Promise<void>;

/**
 * If status DOESN'T EXIST, it ADDS the status.
 * If status EXISTS, it UPDATES the status data.
 * WITHOUT a statusData object as parameter, it sets the status with DEFAULT DATA.
 * WITH a statusData object, it sets the status with the SUPPLIED DATA.
 * @param roomCode - The unique identifier for the room.
 * @param statusData - Status data object of format: { minigame?: EPossibleMinigames, state?: EPossibleStates }
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function setRoomStatus(roomCode: string, statusData: IStatusData, multi: ChainableCommander): Promise<void>;

export async function setRoomStatus(roomCode: string, arg2?: IStatusData | ChainableCommander, arg3?: ChainableCommander): Promise<void> {
  const statusKey = `room:${roomCode}:status`;
  const defaultStatusData: IStatusData = { minigame: EPossibleMinigames.none, state: EPossibleStates.waiting };

  let statusData: IStatusData;
  let multi: ChainableCommander | undefined;

  if (arg2 && typeof arg2 === 'object' && !Array.isArray(arg2) && ('minigame' in arg2 || 'state' in arg2)) {
    statusData = { ...defaultStatusData, ...arg2 };
    multi = arg3;
  } else {
    statusData = defaultStatusData;
    multi = arg2 as ChainableCommander | undefined;
  }

  if (multi) {
    multi.hset(statusKey, statusData);
  } else {
    await client.hset(statusKey, statusData);
  }
}

/**
 * Gets the status of the room.
 * @param roomCode - The unique identifier for the room.
 * @returns A promise that resolves to an object containing the status data or null if the room does not exist.
 * @example output: { minigame: 'none', state: 'waiting' }
 * @example output: null
 */
export async function getRoomStatus(roomCode: string): Promise<IStatusData | null> {
  const statusKey = `room:${roomCode}:status`;
  const statusData = await client.hgetall(statusKey);

  if (Object.keys(statusData).length === 0) {
    return null;
  }

  return statusData as IStatusData;
}

/**
 * Deletes the status of the room.
 * @param roomCode - The unique identifier for the room.
 * @param multi - (OPTIONAL)
 * @returns A promise that resolves to void.
 */
export async function deleteRoomStatus(roomCode: string): Promise<void>;

/**
 * Deletes the status of the room.
 * @param roomCode - The unique identifier for the room.
 * @param multi - Redis client.multi() instance for executing queries in transaction
 * @returns A promise that resolves to void.
 */
export async function deleteRoomStatus(roomCode: string, multi: ChainableCommander): Promise<void>;

export async function deleteRoomStatus(roomCode: string, multi?: ChainableCommander): Promise<void> {
  const statusKey = `room:${roomCode}:status`;

  if (multi) {
    multi.del(statusKey);
  } else {
    await client.del(statusKey);
  }
}
