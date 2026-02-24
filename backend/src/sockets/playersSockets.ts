import { Server, Socket } from 'socket.io';
import { RoomManager } from '@engine-managers/RoomManager';
import { GameStateType } from '@shared/types/GameStateType';
import { COUNTDOWN } from '@shared/constants/gameRules';

export const handlePlayers = (io: Server, socket: Socket) => {
  socket.on('sync_player_session', (storageRoomCode: string, storagePlayerId: string, callback) => {
    if (!storageRoomCode || !storagePlayerId) {
      return callback({ success: false, payload: 'Your session has expired' });
    }

    const room = RoomManager.getRoom(storageRoomCode);
    if (!room) return callback({ success: false, payload: 'Room no longer exists' });

    const players = room.getPlayers();
    if (!players.find((p) => p.id == storagePlayerId)) return callback({ success: false, payload: 'You are not a member of this room' });

    io.to(room.roomCode).emit('got_players', players);

    const roomData = {
      ...room.getData(),
      endAt: 0,
    };

    if (roomData.gameState === GameStateType.Lobby) {
      return callback({
        success: true,
        payload: { roomData: roomData, settings: room.settings },
      });
    } else if (roomData.gameState === GameStateType.Minigame) {
      return callback({
        success: true,
        payload: {
          gameState: GameStateType.Minigame,
          minigameId: 'minigame-id',
          minigameName: 'minigame-name',
        },
      });
    }
  });

  socket.on('toggle_player_ready', async () => {
    const room = RoomManager.getRoom(socket.data.roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    const player = room?.players.get(socket.id);
    if (!player) return { success: false, message: 'Player not found!' };

    player.toggleReady();

    let endAt = null;

    if (room.players.size === room.getReadyPlayers().length) {
      room.startTimer(COUNTDOWN.LOBBY_MS);
      endAt = room.getTimer()!.getEndAt();
    } else {
      if (room.getTimer()) {
        room.getTimer()!.clear();
      }
    }

    io.to(room.roomCode).emit('toggled_player_ready', room.getPlayers(), endAt);
  });

  socket.on('choose_avatar', (avatar, callback) => {
    const room = RoomManager.getRoom(socket.data.roomCode);
    if (!room) return callback({ success: false, payload: 'Room not found!' });

    const isTaken = [...room.players.values()].some((p) => p.avatar === avatar && p.id !== socket.id);
    if (isTaken) return callback({ success: false, payload: 'Avatar already taken!' });

    const player = room.players.get(socket.id);
    if (!player) return callback({ success: false, payload: 'Player not found!' });

    player.avatar = avatar;

    socket.nsp.to(room.roomCode).emit('got_players', room.getPlayers());

    callback({ success: true });
  });
};
