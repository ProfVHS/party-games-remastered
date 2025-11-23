import { BaseMinigame } from './baseMinigame';
import * as roomRepository from '@roomRepository';

export abstract class TurnBasedMinigame extends BaseMinigame {
  protected currentTurn: number = 0;

  async nextTurn() {
    const players = await roomRepository.getAllPlayers(this.roomCode);
    const roomData = await roomRepository.getRoomData(this.roomCode);

    if (!roomData) throw new Error(`Room data not found for room: ${this.roomCode}`);
    if (!players) throw new Error(`Players not found for room: ${this.roomCode}`);

    this.currentTurn = roomData.currentTurn;

    for (let i = 1; i <= players.length; i++) {
      const nextTurn = (this.currentTurn + i) % players.length;
      const potentialPlayer = players[nextTurn];

      if (potentialPlayer.isAlive && !potentialPlayer.isDisconnected) {
        await roomRepository.updateRoomData(this.roomCode, { currentTurn: nextTurn });
        return { id: nextTurn, player_id: potentialPlayer.id, nickname: potentialPlayer.nickname };
      }
    }

    throw new Error(`No suitable player found to change turn for room "${this.roomCode}".`);
  }

  async getTurn() {
    const roomData = await roomRepository.getRoomData(this.roomCode);
    return roomData?.currentTurn;
  }
}
