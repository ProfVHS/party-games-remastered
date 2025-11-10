import { Socket } from 'socket.io';
import { shuffle } from 'lodash';
import * as roomRepository from '@roomRepository';
import { syncPlayerScoreService } from '@playerService';
import { CARDS_RULES } from '@shared/constants/gameRules';
import { handleSocketError, NotFoundError } from '@errors';
import { ErrorEventNameEnum } from '@backend-types';

export const cardsSockets = (socket: Socket) => {
  socket.on('card_select', async (cardId: number) => {
    const roomCode = socket.data.roomCode;
    await roomRepository.updatePlayer(roomCode, socket.id, { selectedObjectId: cardId });
  });
};

export const cardsRound = async (socket: Socket) => {
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

    // For each player, if selectedObjectId is '-100', assign a random card from 0 to 8
    players.forEach((player) => {
      if (player.selectedObjectId === -100 && player.isAlive && !player.isDisconnected) {
        player.selectedObjectId = Math.floor(Math.random() * 9);
      }
    });

    // Determine cards based on the current round
    const roundsCards: Record<string, number[]> = {
      '1': CARDS_RULES.ROUND_1,
      '2': CARDS_RULES.ROUND_2,
      '3': CARDS_RULES.ROUND_3,
    };

    // Shuffle the cards array
    const cards = shuffle(roundsCards[roomData.currentRound]);

    if (!cards) {
      throw new NotFoundError('Cards', roomCode);
    }

    // Update players' scores based on the selected cards
    for (let index = 0; index < cards.length; index++) {
      const card = cards[index];
      const selectedPlayers = players.filter((player) => player.selectedObjectId === index);

      if (selectedPlayers.length > 0) {
        const points = Math.floor(card < 0 ? card * selectedPlayers.length : card / selectedPlayers.length);

        await Promise.all(
          selectedPlayers.map((player) => {
            syncPlayerScoreService(roomCode, player, points);
          }),
        );
      }
    }

    const nextRound = roomData!.currentRound + 1;
    await roomRepository.updateAllPlayers(roomCode, { selectedObjectId: -100 });
    await roomRepository.updateRoomData(roomCode, { currentRound: nextRound });

    socket.nsp.to(roomCode).emit('cards_round_ended', cards, players, nextRound);
  } catch (error: unknown) {
    handleSocketError(socket, roomCode, error, ErrorEventNameEnum.cards);
  }
};
