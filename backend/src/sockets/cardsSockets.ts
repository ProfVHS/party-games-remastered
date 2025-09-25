import { Socket } from 'socket.io';
import { shuffle } from 'lodash';
import * as roomRepository from '@roomRepository';

export const cardsSockets = async (socket: Socket) => {
  socket.on('card_select', async (cardId: number) => {
    await roomRepository.updatePlayer(socket.data.roomCode, socket.id, { selectedObjectId: cardId.toString() });
  });

  socket.on('cards_round_end', async () => {
    const roomCode = socket.data.roomCode;
    const players = await roomRepository.getAllPlayers(roomCode);
    const roomData = await roomRepository.getRoomData(roomCode);

    // For each player, if selectedObjectId is '-100', assign a random card from 0 to 8
    players.forEach((player) => {
      if (player.selectedObjectId === '-100' && player.isAlive === 'true' && player.status !== 'offline') {
        player.selectedObjectId = Math.floor(Math.random() * 9).toString();
      }
    });

    // Determine cards based on the current round
    const roundsCards: Record<string, number[]> = {
      '1': [25, 25, 30, 50, 50, 60, -15, -15, -30],
      '2': [50, 50, 50, 70, 90, -15, -30, -30, -50],
      '3': [50, 90, 90, 120, -40, -40, -70, -70, -90],
    };

    // Shuffle the cards array
    const cards = shuffle(roundsCards[roomData!.currentRound]);

    if (!cards) {
      console.log('The End of the Cards Game');
      return;
    }

    // Update players' scores based on the selected cards
    for (let index = 0; index < cards.length; index++) {
      const card = cards[index];
      const selectedPlayers = players.filter((player) => player.selectedObjectId === index.toString());

      if (selectedPlayers.length > 0) {
        const points = Math.floor(card < 0 ? card * selectedPlayers.length : card / selectedPlayers.length);

        await Promise.all(
          selectedPlayers.map((player) => {
            player.score = (parseInt(player.score) + points).toString();
            return roomRepository.updatePlayerScore(roomCode, player.id, points);
          }),
        );
      }
    }

    const nextRound = (parseInt(roomData!.currentRound) + 1).toString();
    await roomRepository.updateAllPlayers(roomCode, { selectedObjectId: '-100' });
    await roomRepository.updateRoomData(roomCode, { currentRound: nextRound });

    socket.nsp.to(roomCode).emit('cards_round_ended', cards, players, nextRound);
  });
};
