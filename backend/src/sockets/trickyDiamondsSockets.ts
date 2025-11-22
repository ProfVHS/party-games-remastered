import { Socket } from 'socket.io';
import * as roomRepository from '@roomRepository';
import { TRICKY_DIAMONDS_RULES } from '@shared/constants/gameRules';
import { sendAllPlayers } from './playerSockets';
import { handleSocketError, NotFoundError } from '@errors';
import { cleanupRoundService } from '@roomService';
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

    players.forEach((player) => {
      if (player.selectedObjectId === -100 && player.isAlive && !player.isDisconnected) {
        player.selectedObjectId = Math.floor(Math.random() * 3);
      }
    });

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

    const selectedDiamonds = diamondStats.filter((d) => d.count > 0);

    const minCount = Math.min(...selectedDiamonds.map((d) => d.count));
    const maxCount = Math.max(...selectedDiamonds.map((d) => d.count));

    const diamondsWithMinCount = selectedDiamonds.filter((d) => d.count === minCount);
    let diamondWinnerId: number | null = null;

    // There is diamond with unique minimum value
    if (diamondsWithMinCount.length === 1 && minCount !== maxCount) {
      diamondWinnerId = diamondsWithMinCount[0].id;
      players.map(async (player) => {
        if (player.selectedObjectId === diamondsWithMinCount[0].id) {
          await roomRepository.updatePlayerScore(roomCode, player.id, diamonds[diamondsWithMinCount[0].id]);
        }
      });
    }

    await cleanupRoundService(roomCode, socket);
    await sendAllPlayers(socket, roomCode);
    socket.nsp.to(roomCode).emit('tricky_diamonds_round_ended', diamondStats, diamondWinnerId, roomData.currentRound + 1);
  } catch (error: unknown) {
    handleSocketError(socket, roomCode, error, ErrorEventNameEnum.trickyDiamonds);
  }
};
