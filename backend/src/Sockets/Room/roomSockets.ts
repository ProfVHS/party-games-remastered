import { Socket } from 'socket.io';

export const roomSockets = (socket: Socket) => {
  socket.on('create_room', (roomCode, nickname) => {
    socket.join(roomCode);

    // create new room and user

    socket.nsp.to(socket.id).emit('joined_room');
  });

  socket.on('join_room', (roomCode, nickname) => {
    socket.join(roomCode);

    // check if room is full, exist, in_game
    // create new room and user

    socket.nsp.to(socket.id).emit('joined_room');
  });
};
