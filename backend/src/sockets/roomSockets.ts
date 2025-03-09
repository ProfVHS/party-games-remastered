import { Socket } from 'socket.io';
import * as roomService from '../services/roomService';
import { EPossibleMinigames } from '../types/roomRepositoryTypes';

export const roomSockets = (socket: Socket) => {
  socket.on('create_room', async (roomCode: string, nickname: string) => {
    const response = await roomService.createRoomService(roomCode, socket, nickname);

    if (!response.success) {
      socket.nsp.to(socket.id).emit('failed_to_create_room');
      return;
    }

    socket.join(roomCode);
    socket.nsp.to(socket.id).emit('created_room');
  });

  socket.on('join_room', async (roomCode: string, nickname: string) => {
    const response = await roomService.joinRoomService(roomCode, socket, nickname);

    // Payload: 0 = Room does not exist, -1 = Room is full, -100 = Room not joined
    if (!response.success) {
      socket.nsp.to(socket.id).emit('failed_to_join_room', response.payload);
      return;
    }

    socket.join(roomCode);
    // Payload: number of players ready
    socket.nsp.to(socket.id).emit('joined_room', response.payload);
  });

  socket.on('toggle_player_ready', async (roomCode: string, nickname: string) => {
    const response = await roomService.toggleReadyService(roomCode, socket);

    if (!response.success) {
      socket.nsp.to(socket.id).emit('failed_to_toggle');
      return;
    }

    // Payload: number of players ready
    socket.nsp.in(roomCode).emit('toggled_player_ready', response.payload);
  });

  socket.on('start_minigame', async (roomCode: string, minigame: EPossibleMinigames) => {
    const response = await roomService.startMinigameService(roomCode, minigame);

    if (!response.success) {
      socket.nsp.to(socket.id).emit('failed_to_start_minigame');
      return;
    }

    // Payload: minigame data
    socket.nsp.in(roomCode).emit('started_minigame', response.payload);
  });
};
