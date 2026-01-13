import { Server, Socket } from 'socket.io';
import { Player } from '../engine/core/Player';
import { RoomManager } from '../engine/managers/RoomManager';

export const handleConnection = (io: Server, socket: Socket) => {
  socket.on('create_room', (roomCode: string, nickname: string) => {
    let room = RoomManager.getRoom(roomCode);
    if (room) return { success: false, message: `Room ${roomCode} already exists!` };

    room = RoomManager.createRoom(roomCode);
    const player = new Player(socket.id, nickname, true);
    const result = room.addPlayer(player);

    if (result.success) {
      socket.join(roomCode);
      socket.data.roomCode = roomCode;
      io.to(socket.id).emit('created_room', { roomCode, id: socket.id });
    }
  });

  socket.on('join_room', (roomCode: string, nickname: string) => {
    let room = RoomManager.getRoom(roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    const player = new Player(socket.id, nickname);
    const result = room.addPlayer(player);

    if (result.success) {
      socket.join(roomCode);
      socket.data.roomCode = roomCode;
      socket.to(roomCode).emit('player_join_toast', nickname);
      io.to(socket.id).emit('joined_room', { roomCode, id: socket.id });
    }
  });

  socket.on('disconnect', () => {
    let room = RoomManager.getRoom(socket.data.roomCode);

    console.log('Socket disconnected: ', room?.getGameState(), socket.id);

    room?.removePlayer(socket.id);

    if (room?.getPlayers().length === 0) {
      RoomManager.deleteRoom(room.roomCode);
    }

    io.to(socket.data.roomCode).emit('got_players', room?.getPlayers());
  });
};
