import { Server, Socket } from 'socket.io';
import { RoomManager } from '../engine/managers/RoomManager';
import { RoomSettingsType } from '@shared/types/RoomSettingsType';
import { MinigameDataType, MinigameNamesEnum } from '@shared/types';
import { ClickTheBomb } from '../engine/minigame/ClickTheBomb';
import { TurnBasedMinigame } from '../engine/minigame/base/TurnBasedMinigame';
import { TurnBaseTimeoutState } from '../types/MinigameTypes';

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
    if (!room.getPlayer(socket.id)?.isHost()) return { success: false, message: 'Player is not a host!' };

    if (room.settings.getMinigames().length === 0) {
      room.settings.randomiseMinigames();
    }

    room.players.forEach((player) => {
      player.setReady(false);
    });

    const ctb = createClickTheBombConfig(2);
    room.currentMinigame = new ClickTheBomb(room.players, (state: TurnBaseTimeoutState) => {
      const game = room.currentMinigame as TurnBasedMinigame;

      switch (state) {
        case 'NEXT_TURN':
          io.to(roomCode).emit('got_turn', game.getCurrentTurnPlayer());
          io.to(roomCode).emit('got_players', room.getPlayers());
          break;
        case 'END_GAME':
          io.to(roomCode).emit('changed_turn', game.getCurrentTurnPlayer());
          io.to(roomCode).emit('player_exploded');
          break;
      }
    });
    room.currentMinigame.start();
    io.to(roomCode).emit('started_minigame', ctb);
  });

  socket.on('tutorial_player_ready', async () => {
    const room = RoomManager.getRoom(socket.data.roomCode);
    const player = room?.getPlayer(socket.id);
    player?.toggleReady();

    const readyPlayersLength = room?.getReadyPlayers().length;

    if (room?.getPlayers().length === readyPlayersLength) {
      io.to(socket.data.roomCode).emit('tutorial_completed');
    } else {
      io.to(socket.data.roomCode).emit('tutorial_ready_status', readyPlayersLength);
    }
  });
};

const createClickTheBombConfig = (alivePlayersLength: number): MinigameDataType => ({
  minigameName: MinigameNamesEnum.clickTheBomb,
  clickCount: 0,
  maxClicks: Math.floor(Math.random() * (alivePlayersLength * 4)) + 1,
  streak: 0,
  prizePool: 0,
});
