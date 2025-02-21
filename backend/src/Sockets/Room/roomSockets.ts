import { Socket } from 'socket.io';
import { createRoom, joinRoom } from '../../repositories/room';

export const roomSockets = (socket: Socket) => {
  socket.on('create_room', async (roomCode: string, nickname: string) => {
    socket.join(roomCode);

    await createRoom(roomCode, nickname);

    socket.nsp.to(socket.id).emit('joined_room');
  });

  socket.on('join_room', async (roomCode: string, nickname: string) => {
    socket.join(roomCode);

    await joinRoom(roomCode, nickname);

    socket.nsp.to(socket.id).emit('joined_room');
  });
};
