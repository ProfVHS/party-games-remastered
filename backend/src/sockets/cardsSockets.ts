import { Socket } from 'socket.io';
import * as roomRepository from '../repositories/roomRepository/roomRepository';
import { client } from '../config/db';

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

    let cards: number[] = [];

    // Determine cards based on the current round
    switch (roomData!.currentRound) {
      case '1':
        cards = [25, 25, 30, 50, 50, 60, -15, -15, -30];
        console.log('Starting cards round 1');
        break;
      case '2':
        cards = [50, 50, 50, 70, 90, -15, -30, -30, -50];
        console.log('Starting cards round 2');
        break;
      case '3':
        cards = [50, 90, 90, 120, -40, -40, -70, -70, -90];
        console.log('Starting cards round 3');
        break;
      default:
        console.log('Starting cards round default');
        break;
    }

    // Shuffle the cards array
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [cards[i], cards[j]] = [cards[j], cards[i]]; // swap elements
    }

    // Update players' scores based on the selected cards
    cards.forEach((card, index) => {
      const selectedPlayers = players.filter((player) => player.selectedObjectId === index.toString());

      if (selectedPlayers.length > 0) {
        const points = Math.floor(card < 0 ? card * selectedPlayers.length : card / selectedPlayers.length);

        selectedPlayers.forEach((player) => {
          roomRepository.updatePlayerScore(roomCode, player.id, points);
          player.score = (parseInt(player.score) + points).toString();
        });
      }
    });

    socket.nsp.to(roomCode).emit('cards_round_ended', cards, players);
  });
};
