import { Socket } from 'socket.io';
import * as roomRepository from '@roomRepository';
import { TRICKY_DIAMONDS_RULES } from '@shared/constants/gameRules';
import { sendAllPlayers } from './playerSockets';
import { handleSocketError, NotFoundError } from '@errors';
import { ErrorEventNameEnum } from '@backend-types';

export const trickyDiamondsSockets = (socket: Socket) => {
  socket.on('diamond_select', async (diamondId: number) => {
    const roomCode = socket.data.roomCode;
    await roomRepository.updatePlayer(roomCode, socket.id, { selectedObjectId: diamondId });
  });
};

export const trickyDiamondsRound = async (socket: Socket) => {
  const roomCode = socket.data.roomCode;
  const players = await roomRepository.getAllPlayers(roomCode);
  const roomData = await roomRepository.getRoomData(roomCode);

  try {
    if (!roomCode) {
      throw new NotFoundError('Room code', roomCode);
    }

    if (!players) {
      throw new NotFoundError('Players', roomCode);
    }

    if (!roomData) {
      throw new NotFoundError('Room', roomCode);
    }

    // For each player, if selectedObjectId is '-100', assign a random diamond from 0 to 2
    players.forEach((player) => {
      if (player.selectedObjectId === -100 && player.isAlive && !player.isDisconnected) {
        player.selectedObjectId = Math.floor(Math.random() * 3);
      }
    });

    // Determine diamonds value based on the current round
    const roundsDiamonds = [TRICKY_DIAMONDS_RULES.ROUND_1, TRICKY_DIAMONDS_RULES.ROUND_2, TRICKY_DIAMONDS_RULES.ROUND_3];
    const diamonds = roundsDiamonds[roomData.currentRound - 1];

    const diamondStats = [0, 1, 2].map((id) => {
      const playersForDiamond = players.filter((p) => p.isAlive && !p.isDisconnected && p.selectedObjectId === id).map((p) => p.nickname);
      return {
        id,
        count: playersForDiamond.length,
        players: playersForDiamond,
      };
    });

    // Skips those that no one chose
    const valid = diamondStats.filter((d) => d.count > 0);

    const minCount = Math.min(...valid.map((v) => v.count));
    const maxCount = Math.max(...valid.map((v) => v.count));

    if (minCount === maxCount) {
      const nextRound = roomData.currentRound + 1;
      await roomRepository.updateAllPlayers(roomCode, { selectedObjectId: -100 });
      await roomRepository.updateRoomData(roomCode, { currentRound: nextRound });
      socket.nsp.to(roomCode).emit('tricky_diamonds_round_ended', diamondStats, null, roomData.currentRound);
      return;
    }

    const minDiamonds = valid.filter((v) => v.count === minCount);

    if (minDiamonds.length === 1) {
      players.map(async (player) => {
        if (player.selectedObjectId === minDiamonds[0].id) {
          await roomRepository.updatePlayerScore(roomCode, player.id, diamonds[minDiamonds[0].id]);
        }
      });
    }

    const nextRound = roomData.currentRound + 1;
    await roomRepository.updateAllPlayers(roomCode, { selectedObjectId: -100 });
    await roomRepository.updateRoomData(roomCode, { currentRound: nextRound });
    await sendAllPlayers(socket, roomCode);
    socket.nsp.to(roomCode).emit('tricky_diamonds_round_ended', diamondStats, minDiamonds[0].id, nextRound);
  } catch (error: unknown) {
    handleSocketError(socket, roomCode, error, ErrorEventNameEnum.trickyDiamonds);
  }
};
