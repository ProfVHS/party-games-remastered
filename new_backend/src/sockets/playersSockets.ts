import { RoomManager } from '../engine/managers/RoomManager';
import { Server, Socket } from 'socket.io';
import { GameStateType } from '@shared/types/GameStateType';

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

    const roomGameState = room.getGameState();

    if (roomGameState === GameStateType.lobby) {
      return callback({
        success: true,
        payload: {
          gameState: roomGameState,
          roomSettings: room.settings,
        },
      });
    } else if (roomGameState === GameStateType.playing) {
      return callback({
        success: true,
        payload: {
          gameState: roomGameState,
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
    io.to(room.roomCode).emit('toggled_player_ready', room.getPlayers());
  });
};
