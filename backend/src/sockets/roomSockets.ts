import { Socket } from 'socket.io';
import * as roomService from '@roomService';
import { setRoomData, getRoomData } from '@roomRepository';
import { createRoomConfig } from '@config/minigames';
import { RoomDataType, RoomStatusEnum } from '@shared/types';

export const roomSockets = (socket: Socket) => {
  socket.on('create_room', async (roomCode: string, nickname: string) => {
    const response = await roomService.createRoomService(roomCode, socket, nickname);

    if (!response.success) {
      socket.nsp.to(socket.id).emit('failed_to_create_room');
      return;
    }

    // Initialize room configuration to help with diconnect and reconnect events
    const roomConfig = createRoomConfig(1, RoomStatusEnum.lobby);

    const roomData: RoomDataType = { roomCode, minigameIndex: '0', ...roomConfig };

    await setRoomData(roomCode, roomData);

    socket.join(roomCode);
    socket.nsp.to(socket.id).emit('created_room', { roomCode: roomCode, id: socket.id });
  });

  socket.on('join_room', async (roomCode: string, nickname: string, storageId: string) => {
    const response = await roomService.joinRoomService(roomCode, socket, nickname, storageId);

    // Payload: -1 = Room does not exist, -2 = Room is full, -3 = Room is in game, -100 = Room not joined
    if (!response.success) {
      socket.nsp.to(socket.id).emit('failed_to_join_room', response.payload);
      return;
    }

    socket.join(roomCode);

    socket.to(roomCode).emit('player_join_toast', nickname);
    socket.nsp.to(socket.id).emit('joined_room', { roomCode: roomCode, id: socket.id });
  });

  socket.on('get_room_data', async () => {
    const roomCode = socket.data.roomCode;
    const gameData = await getRoomData(roomCode);

    if (gameData) {
      socket.nsp.to(socket.id).emit('got_room_data', gameData);
    } else {
      socket.nsp.to(socket.id).emit('failed_to_get_room_data');
    }
  });
};
