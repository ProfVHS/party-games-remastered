import { Socket } from 'socket.io';
import * as roomService from '../services/roomService';
import * as roomRepository from '../repositories/roomRepository/roomRepository';

export const playerSockets = (socket: Socket) => {
  socket.on('toggle_player_ready', async () => {
    const roomCode = socket.data.roomCode;
    const response = await roomService.toggleReadyService(socket);

    if (!response.success) {
      socket.nsp.to(socket.id).emit('failed_to_toggle');
      return;
    }

    // Payload: number of players ready
    socket.nsp.in(roomCode).emit('toggled_player_ready', response.payload);
  });

  socket.on('get_players', async () => {
    const roomCode = socket.data.roomCode;
    const response = await roomRepository.getAllPlayers(roomCode);

    socket.nsp.to(roomCode).emit('got_players', response);
  });

  socket.on('fetch_ready_players', async () => {
    const roomCode = socket.data.roomCode;

    const playersReady = await roomRepository.getReadyPlayersCount(roomCode);
    socket.nsp.to(roomCode).emit('fetched_ready_players', playersReady);
  });
};
