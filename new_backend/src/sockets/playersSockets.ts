import { RoomManager } from '../engine/RoomManager';
import { Server, Socket } from 'socket.io';

export const handlePlayers = (io: Server, socket: Socket) => {
  socket.on('check_if_user_in_room', (roomCode: string, storageId: string, callback) => {
    if (!roomCode || !storageId) {
      console.error('Room code or ID is missing');
      return callback({ success: false });
    }
    const room = RoomManager.getRoom(roomCode);
    if (!room) return { success: false, message: 'Room not found!' };
    callback(room.checkIfUserIsInRoom(socket.id));
  });

  socket.on('get_players', () => {
    const room = RoomManager.getRoom(socket.data.roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    const players = room.getPlayers();
    socket.nsp.to(room.roomCode).emit('got_players', players);
  });

  socket.on('toggle_player_ready', async () => {
    const room = RoomManager.getRoom(socket.data.roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    const player = room?.players.get(socket.id);
    if (!player) return { success: false, message: 'Player not found!' };

    player.toggleReady();
    io.to(room.roomCode).emit('toggled_player_ready', room.getReadyPlayers());
  });

  socket.on('fetch_ready_players', async () => {
    const room = RoomManager.getRoom(socket.data.roomCode);
    if (!room) return { success: false, message: 'Room not found!' };
    io.to(room.roomCode).emit('fetched_ready_players', room.getReadyPlayers());
  });

  // TODO: Change it
  socket.on('choose_avatar', (avatar, callback) => {
    const room = RoomManager.getRoom(socket.data.roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    const players = room.getPlayers();

    if (players.find((p) => p.avatar === avatar && p.id !== socket.id)) {
      callback({ success: false, message: 'Avatar already taken!' });
      return;
    }

    const player = room?.players.get(socket.id);
    if (!player) return { success: false, message: 'Player not found!' };

    player.setAvatar(avatar);

    const players2 = room.getPlayers();

    socket.nsp.to(room.roomCode).emit('got_players', players2);

    callback({ success: true });
  });
};
