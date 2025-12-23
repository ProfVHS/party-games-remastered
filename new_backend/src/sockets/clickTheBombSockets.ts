import { Socket } from 'socket.io';
import { RoomManager } from '../engine/RoomManager';

export const clickTheBombSockets = (socket: Socket) => {
  socket.on('bomb_click', async () => {
    const room = RoomManager.getRoom(socket.data.roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    room.currentMinigame;
  });
};
