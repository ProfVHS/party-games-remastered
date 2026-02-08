import { Room } from '@engine/core/room/Room';

export class RoomManager {
  private static rooms = new Map<string, Room>();

  static createRoom(roomCode: string) {
    const room = new Room(roomCode);
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
