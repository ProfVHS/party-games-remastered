import { Server, Socket } from 'socket.io';
import { RoomManager } from '@engine-managers/RoomManager';
import { RoomSettingsType } from '@shared/types/RoomSettingsType';
import { TurnBasedMinigame } from '@minigame-base/TurnBasedMinigame';
import { RoundBasedMinigame } from '@minigame-base/RoundBasedMinigame';
import { RoundBaseTimeoutState, TurnBaseTimeoutState } from '@backend-types';
import { getMinigame } from '@engine-managers/MinigameManager';
import { MinigameNamesEnum } from '@shared/types';

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

  socket.on('set_minigame', async () => {
    const roomCode = socket.data.roomCode;
    const room = RoomManager.getRoom(roomCode);
    if (!room) return { success: false, message: 'Room not found!' };
    if (!room.getPlayer(socket.id)?.isHost()) return { success: false, message: 'Player is not a host!' };

    if (room.settings.getMinigames().length === 0) {
      room.settings.randomiseMinigames();
    }

    room.setAllReady(false);

    const currentMinigame = MinigameNamesEnum.cards;
    const currentMinigameClass = getMinigame(currentMinigame);

    room.currentMinigame = new currentMinigameClass(room.players, (state: TurnBaseTimeoutState | RoundBaseTimeoutState) => {
      const game = room.currentMinigame;

      if (game instanceof TurnBasedMinigame) {
        switch (state) {
          case 'NEXT_TURN':
            io.to(roomCode).emit('turn_timeout', game.getCurrentTurnPlayer(), room.getPlayers(), game.getTimer().getEndAt());
            break;
          case 'END_GAME':
            room.setMinigameStarted(false);
            io.to(roomCode).emit('changed_turn', game.getCurrentTurnPlayer());
            io.to(roomCode).emit('player_exploded');
            io.to(roomCode).emit('ended_minigame', room.getPlayers());
            break;
        }
      } else if (game instanceof RoundBasedMinigame) {
        switch (state) {
          case 'SHOW_RESULT':
            console.log('SHOW_RESULT');
            io.to(roomCode).emit('round_end', game.getGameData(), room.getPlayers());
            break;
          case 'NEXT_ROUND':
            console.log('NEXT_ROUND');
            room.setMinigameStarted(false);
            room.setAllReady(false);
            io.to(roomCode).emit('round_next', game.getRound());
            break;
          case 'END_GAME':
            console.log('END_GAME');
            room.setMinigameStarted(false);
            io.to(roomCode).emit('ended_minigame', room.getPlayers());
            break;
        }
      }
    });

    io.to(roomCode).emit('started_minigame', currentMinigame, room.getTutorialsSettings());
  });

  socket.on('start_minigame_queue', async () => {
    const roomCode = socket.data.roomCode;
    const room = RoomManager.getRoom(roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    room.getPlayer(socket.id)?.setReady(true);

    const readyPlayers = Array.from(room.players.values()).filter((player) => player.isReady());

    if (room.getMinigameStarted()) return;

    //TODO: it works, it can be better though (Too many timers are creating)
    room.scheduleStart(readyPlayers.length >= room.players.size ? 500 : 2000, () => {
      const game = room.currentMinigame;

      if (!game) return;

      game.start();

      if (game instanceof RoundBasedMinigame) {
        io.to(roomCode).emit('round_timeout', game.getTimer().getEndAt());
      } else if (game instanceof TurnBasedMinigame) {
        io.to(roomCode).emit('turn_timeout', game.getCurrentTurnPlayer(), room.getPlayers(), game.getTimer().getEndAt());
      }
    });
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
