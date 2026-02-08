import { Socket } from 'socket.io';
import { RoomManager } from '@engine/managers/RoomManager';

export const validationMiddleware = (socket: Socket) => {
  socket.use((packet, next) => {
    try {
      const [eventName] = packet;

      console.log(eventName);

      const skipValidationEvents = ['create_room', 'join_room', 'sync_player_session'];

      if (skipValidationEvents.includes(eventName)) {
        return next();
      }

      const room = RoomManager.getRoom(socket.data.roomCode);
      if (!room) {
        console.log('Room not found!');
        return;
      }

      const player = room.getPlayer(socket.id);
      if (!player) {
        console.log('Player not found!');
        return;
      }

      next();
    } catch (err: unknown) {
      next(err instanceof Error ? err : new Error('Unknown error'));
    }
  });
};
