import { Socket } from 'socket.io';
import * as roomService from '../services/roomService';
import * as roomRepository from '../repositories/roomRepository/roomRepository';
import { EPossibleMinigames } from '../interfaces/roomRepositoryInterfaces';

export const roomSockets = (socket: Socket) => {
  socket.on('create_room', async (roomCode: string, nickname: string) => {
    const response = await roomService.createRoomService(roomCode, nickname);

    if (!response.success) {
      socket.nsp.to(socket.id).emit('failed_to_create_room');
      return;
    }

    socket.join(roomCode);
    socket.nsp.to(socket.id).emit('created_room');
  });

  socket.on('join_room', async (roomCode: string, nickname: string) => {
    const response = await roomService.joinRoomService(roomCode, nickname);

    if (!response.success) {
      socket.nsp.to(socket.id).emit('failed_to_join_room', response.payload);
      return;
    }

    socket.join(roomCode);
    socket.nsp.to(socket.id).emit('joined_room', response.payload);
  });

  socket.on('toggle_player_ready', async (roomCode: string, nickname: string) => {
    const response = await roomService.toggleReadyService(roomCode, nickname);

    if (!response.success) {
      socket.nsp.to(socket.id).emit('failed_to_toggle');
      return;
    }

    socket.nsp.in(roomCode).emit('toggled_player_ready', response.payload);
  });

  socket.on('start_minigame', async (roomCode: string, minigame: EPossibleMinigames) => {
    const response = await roomService.startMinigameService(roomCode, minigame);

    if (!response.success) {
      socket.nsp.to(socket.id).emit('failed_to_start_minigame');
      return;
    }

    socket.nsp.in(roomCode).emit('started_minigame', minigame);
  });
};
