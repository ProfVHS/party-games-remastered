import { Server, Socket } from 'socket.io';
import { RoomManager } from '../engine/room/RoomManager';
import { RoomSettingsType } from '@shared/types/RoomSettingsType';
import { MinigameDataType, MinigameNamesEnum } from '@shared/types';
import { ClickTheBomb } from '../engine/minigame/ClickTheBomb';

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

  socket.on('get_room_settings', async () => {
    const room = RoomManager.getRoom(socket.data.roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    io.to(socket.id).emit('got_room_settings', room.settings.getData());
  });

  socket.on('start_minigame_queue', async () => {
    const roomCode = socket.data.roomCode;
    const room = RoomManager.getRoom(roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    if (room.settings.minigames.length === 0) {
      room.randomiseMinigames();
    }

    const ctb = createClickTheBombConfig(2);
    room.currentMinigame = new ClickTheBomb(room.players, ctb);
    io.to(roomCode).emit('started_minigame', ctb);
  });
};

const createClickTheBombConfig = (alivePlayersLength: number): MinigameDataType => ({
  minigameName: MinigameNamesEnum.clickTheBomb,
  clickCount: 0,
  maxClicks: Math.floor(Math.random() * (alivePlayersLength * 4)) + 1,
  streak: 0,
  prizePool: 0,
});
