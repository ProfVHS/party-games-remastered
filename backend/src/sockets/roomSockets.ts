import { Server, Socket } from 'socket.io';
import { RoomManager } from '@engine-managers/RoomManager';
import { RoomSettingsType } from '@shared/types/RoomSettingsType';
import { GameStateType } from '@shared/types';
import { COUNTDOWN } from '@shared/constants/gameRules';

export const handleRoom = (io: Server, socket: Socket) => {
  socket.on('update_room_settings', async (roomSettings: RoomSettingsType, callback: () => void) => {
    const room = RoomManager.getRoom(socket.data.roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    room.settings.update(roomSettings);
    socket.to(room.roomCode).emit('updated_room_settings', roomSettings);
    callback();
  });

  socket.on('tutorial_player_ready', async () => {
    const room = RoomManager.getRoom(socket.data.roomCode);
    const player = room?.getPlayer(socket.id);
    player?.toggleReady();

    const readyPlayersLength = room?.getReadyPlayers().length;

    if (room?.getPlayers().length === readyPlayersLength) {
      console.log('Juz tak');
      if (!room) return { success: false, message: 'Room not found!' };
      room.getTimer()?.clear();

      room.setGameState(GameStateType.Animation);
      room.startTimer(COUNTDOWN.ANIMATION_MS);

      const endAt = room.getTimer()?.getEndAt();

      io.to(socket.data.roomCode).emit('update_game_state', { ...room.getData(), endAt });
    } else {
      console.log('Jeszcze nie');

      io.to(socket.data.roomCode).emit('tutorial_ready_status', readyPlayersLength);
    }
  });
};
