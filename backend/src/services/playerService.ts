import { client } from '@config/db';
import { Socket } from 'socket.io';
import { ChainableCommander } from 'ioredis';
import * as roomRepository from '@roomRepository';
import { PlayerType, ReturnDataType } from '@shared/types';
import { ReadyNameEnum } from '@backend-types';

export const syncPlayerScoreService = async (roomCode: string, player: PlayerType, delta: number): Promise<PlayerType | null> => {
  try {
    await roomRepository.updatePlayerScore(roomCode, player.id, delta);

    if (player) {
      const newScore = player.score + delta;
      player.score = newScore < 0 ? 0 : newScore

      return player;
    } else {
      console.error(`Player "${player}" not found in room "${roomCode}".`);
      return null;
    }
  } catch (error) {
    console.error(`Player update score failed for player: ${player}: ${error}`);
    return null;
  }
};

export const syncPlayerUpdateService = async (roomCode: string, player: PlayerType, updates: Partial<PlayerType>): Promise<PlayerType | null> => {
  try {
    await roomRepository.updatePlayer(roomCode, player.id, updates);

    if (player) {
      Object.assign(player, updates);
      return player;
    } else {
      console.error(`Player with id "${player}" not found in room "${roomCode}".`);
      return null;
    }
  } catch (error) {
    console.error(`Player update failed for player: ${player}: ${error}`);
    return null;
  }
};

export const findAlivePlayersService = async (players: PlayerType[]): Promise<PlayerType[] | null> => {
  try {
    return players.filter((player) => player.isAlive);
  } catch (error) {
    console.error(`Finding all alive players failed for players: ${players}`);
    return null;
  }
};

export const deletePlayerService = async (socket: Socket): Promise<ReturnDataType> => {
  const playerID = socket.id;
  const roomCode = socket.data.roomCode;
  let multi: ChainableCommander;

  try {
    multi = client.multi();

    await roomRepository.deletePlayer(roomCode, playerID, multi);
    await roomRepository.deletePlayerFromReadyTable(roomCode, playerID, ReadyNameEnum.minigame, multi);

    await multi.exec();

    const players = await roomRepository.getAllPlayers(roomCode);
    if (players.length === 0) return { success: true, payload: 1 }; // Last player in room
  } catch (error) {
    console.error(`Player deletion failed for player: ${playerID}: ${error}`);
    return { success: false }; // Player not deleted
  }

  return { success: true, payload: 0 }; // Player deleted
};
