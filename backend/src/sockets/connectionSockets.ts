import { Socket } from 'socket.io';
import * as roomService from '../services/roomService';
import * as roomRepository from '../repositories/roomRepository/roomRepository';
import { RoomStatusEnum } from '@shared/types';
import { MIN_PLAYERS_TO_START } from '@shared/constants/game';

export const connectionSockets = (socket: Socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on('disconnect', async (reason) => {
    const roomCode = socket.data.roomCode;
    const roomData = await roomRepository.getRoomData(roomCode);

    socket.leave(roomCode);
    console.log(`Disconnected: ${socket.id} (Reason: ${reason})`);

    const response = await roomService.deletePlayerService(socket);
    if (!response.success) return;

    // Payload: 1 - You are the last player in the room
    if (response.payload == 1) {
      await roomService.deleteRoomService(socket);
      return;
    }

    // Lobby
    if (roomData?.status === RoomStatusEnum.lobby) {
      let playersReady = await roomRepository.getReadyPlayersCount(roomCode);
      const playerIds = await roomRepository.getAllPlayerIds(roomCode);

      // Prevents the minigame from starting if a player disconnects
      // but the required number of players to start still appears ready
      if (playersReady === playerIds.length && playersReady >= MIN_PLAYERS_TO_START) {
        await roomRepository.deleteReadyTable(roomCode);
        socket.to(roomCode).emit('failed_to_start_minigame');
        playersReady = 0;
      }

      socket.to(roomCode).emit('fetched_ready_players', playersReady);
    }

    const players = await roomRepository.getAllPlayers(roomCode);
    socket.to(roomCode).emit('got_players', players);
  });

  socket.on('check_if_user_in_room', async (roomCode: string, storageId: string, callback) => {
    if (!roomCode || !storageId) {
      console.error('Room code or ID is missing');
      return callback({ success: false });
    }

    // TODO: Check if player is in the room (localStroage)
    const playerData = await roomRepository.getPlayer(roomCode, socket.id);
    const roomData = await roomRepository.getRoomData(roomCode);

    if (!playerData || !roomData) {
      return callback({ success: false, payload: 'Your session has expired or the room no longer exists' });
    }

    return callback({ success: true });
  });
};
