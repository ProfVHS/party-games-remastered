import { updatePlayer, updatePlayerScore } from '@roomRepository';
import { PlayerType, ReturnDataType } from '@shared/types';

export const syncPlayerScore = async (roomCode: string, playerId: string, delta: number, players: PlayerType[]): Promise<PlayerType | null> => {
  try {
    updatePlayerScore(roomCode, playerId, delta);

    const player = players.find((p) => p.id === playerId);
    if (player) {
      player.score = (parseInt(player.score) + delta).toString();
      return player;
    } else {
      console.error(`Player with id "${playerId}" not found in room "${roomCode}".`);
      return null;
    }
  } catch (error) {
    console.error(`Player update score failed for player: ${playerId}: ${error}`);
    return null;
  }
};

export const syncPlayerUpdate = async (roomCode: string, playerId: string, updates: Partial<PlayerType>, players: PlayerType[]): Promise<PlayerType | null> => {
  try {
    await updatePlayer(roomCode, playerId, updates);

    const player = players.find((p) => p.id === playerId);
    if (player) {
      Object.assign(player, updates);
      return player;
    } else {
      console.error(`Player with id "${playerId}" not found in room "${roomCode}".`);
      return null;
    }
  } catch (error) {
    console.error(`Player update failed for player: ${playerId}: ${error}`);
    return null;
  }
};

export const findAlivePlayers = async (players: PlayerType[]): Promise<PlayerType[] | null> => {
  try {
    return players.filter((player) => player.isAlive == 'true');
  } catch (error) {
    console.error(`Finding all alive players failed for players: ${players}`);
    return null;
  }
};
