import { RoomManager } from '../engine/managers/RoomManager';
import { Server, Socket } from 'socket.io';
import { GameStateType } from '@shared/types/GameStateType';

export const handlePlayers = (io: Server, socket: Socket) => {
  socket.on('sync_player_session', (storageRoomCode: string, storagePlayerId: string, callback) => {
    if (!storageRoomCode || !storagePlayerId || !socket.data.roomCode) {
      return callback({ success: false, message: 'Room code or ID is missing' });
    }

    const room = RoomManager.getRoom(storageRoomCode);
    if (!room) return callback({ success: false, message: 'Room not found!' });

    const player = room.getPlayer(storagePlayerId);
    if (!player) return callback({ success: false, message: 'Player not found!' });

    const players = room.getPlayers();
    io.to(room.roomCode).emit('got_players', players);

    const roomGameState = room.getGameState();

    if (roomGameState === GameStateType.lobby) {
      return callback({
        success: true,
        payload: {
          gameState: roomGameState,
          roomSettings: room.settings,
          playerIdsReady: room.getReadyPlayers(),
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
    io.to(room.roomCode).emit('toggled_player_ready', room.getReadyPlayers());
  });
};
