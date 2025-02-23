import { Socket } from 'socket.io';
import { createRoom, joinRoom, toggleReady } from '../../repositories/room';

export const roomSockets = (socket: Socket) => {
  socket.on('create_room', async (roomCode: string, nickname: string) => {
    socket.join(roomCode);

    await createRoom(roomCode, nickname);

    socket.nsp.to(socket.id).emit('joined_room');
  });

  socket.on('join_room', async (roomCode: string, nickname: string) => {
    const readyCount = await joinRoom(roomCode, nickname);

    if (readyCount === -1) {
      socket.nsp.to(socket.id).emit('room_not_found');
    } else {
      socket.join(roomCode);
      socket.nsp.to(socket.id).emit('joined_room');
      socket.nsp.to(socket.id).emit('fetched_players_ready', readyCount);
    }
  });

  socket.on('toggle_player_ready', async (roomCode: string, nickname: string) => {
    const readyCount = await toggleReady(roomCode, nickname);

    socket.nsp.in(roomCode).emit('toggled_player_ready', readyCount);
  });
};
