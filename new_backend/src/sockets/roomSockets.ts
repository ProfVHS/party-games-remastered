import { Server, Socket } from 'socket.io';
import { RoomManager } from '../engine/RoomManager';
import { RoomSettingsType } from '@shared/types/RoomSettingsType';

export const handleRoom = (io: Server, socket: Socket) => {
  socket.on('get_room_data', () => {
    const roomCode = socket.data.roomCode;
    const room = RoomManager.getRoom(roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    const roomData = room.getData();

    if (roomData) {
      socket.nsp.to(socket.id).emit('got_room_data', roomData);
    } else {
      socket.nsp.to(socket.id).emit('failed_to_get_room_data');
    }
  });

  socket.on('update_room_settings', async (roomSettings: RoomSettingsType, callback: () => void) => {
    const room = RoomManager.getRoom(socket.data.roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    room.settings.update(roomSettings);
    socket.to(room.roomCode).emit('updated_room_settings', roomSettings);
    callback();
  });
};
