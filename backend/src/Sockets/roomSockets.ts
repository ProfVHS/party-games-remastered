import { Socket } from 'socket.io';
import * as roomService from '../services/roomService';
import * as roomRepository from '../repositories/roomRepository/roomRepository';

export const roomSockets = (socket: Socket) => {
  socket.on('create_room', async (roomCode: string, nickname: string) => {
    const response = await roomService.createRoomService(roomCode, nickname);

    if (!response.success) {
      // TODO: Handle this emit on frontend
      socket.nsp.to(socket.id).emit('room_creation_failed');
      return;
    }

    socket.join(roomCode);
    // TODO: Change to separate emit called 'created_room' and handle it on frontend
    socket.nsp.to(socket.id).emit('joined_room');
  });

  socket.on('join_room', async (roomCode: string, nickname: string) => {
    const response = await roomService.joinRoomService(roomCode, nickname);

    if (!response.success) {
      // TODO: change name of this emit to 'room_join_failed' and handle it on frontend
      // Also change emit's payload depending on response.payload
      socket.nsp.to(socket.id).emit('room_not_found');
      return;
    }

    socket.join(roomCode);
    socket.nsp.to(socket.id).emit('joined_room');
    // TODO: Check if this emit is necessary when we create separate emit for 'created_room'
    socket.nsp.to(socket.id).emit('fetched_players_ready', response.payload);
  });

  socket.on('toggle_player_ready', async (roomCode: string, nickname: string) => {
    const response = await roomService.toggleReadyService(roomCode, nickname);

    if (!response.success) {
      // TODO: Handle this emit on frontend
      socket.nsp.to(socket.id).emit('toggle_player_ready_failed');
      return;
    }

    socket.nsp.in(roomCode).emit('toggled_player_ready', response.payload);
  });
};
