import { Socket } from 'socket.io';
import { createRoom, joinRoom, toggleReady } from '../../repositories/room';

export const roomSockets = (socket: Socket) => {
  socket.on('create_room', async (roomCode: string, nickname: string) => {
    socket.join(roomCode);

    await createRoom(roomCode, nickname);

    socket.nsp.to(socket.id).emit('joined_room');
  });

  socket.on('join_room', async (roomCode: string, nickname: string) => {
    socket.join(roomCode);

    const readyCount = await joinRoom(roomCode, nickname);

    socket.nsp.to(socket.id).emit('joined_room');
    socket.nsp.to(socket.id).emit('fetch_players_ready', readyCount);
  });

  socket.on('toggle_ready_client', async (roomCode: string, nickname: string) => {
    const readyCount = await toggleReady(roomCode, nickname);

    socket.nsp.in(roomCode).emit('toggle_ready_server', readyCount);
  });
};
