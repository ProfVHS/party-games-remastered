import { Room } from '@engine-core/room/Room';
import { GameStateType } from '@shared/types';

export class RoomManager {
  private static rooms = new Map<string, Room>();

  static createRoom(roomCode: string, onGameStateEnd: (room: Room, state: GameStateType) => void) {
    const room = new Room(roomCode, onGameStateEnd);
    this.rooms.set(roomCode, room);
    return room;
  }

  static getRoom(roomCode: string): Room | undefined {
    return this.rooms.get(roomCode);
  }

  static deleteRoom(roomCode: string) {
    this.rooms.delete(roomCode);
  }
}
