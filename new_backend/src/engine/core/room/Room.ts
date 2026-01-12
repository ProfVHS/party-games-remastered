import { GameStateType } from '../../../types/gameStateType';
import { Player } from '../Player';
import { MAX_PLAYERS } from '@shared/constants/gameRules';
import { RoomSettings } from './RoomSettings';
import { BaseMinigame } from '../../minigame/base/BaseMinigame';

export class Room {
  public readonly roomCode: string;
  public readonly settings: RoomSettings;

  public players: Map<string, Player>;
  public currentMinigame: BaseMinigame | null;
  private gameState: GameStateType;

  constructor(roomCode: string) {
    this.roomCode = roomCode;
    this.players = new Map();
    this.gameState = GameStateType.lobby;
    this.settings = new RoomSettings();
    this.currentMinigame = null;
  }

  public addPlayer = (player: Player) => {
    if (this.players.size >= MAX_PLAYERS) {
      return { success: false, message: 'Room is full!' };
    }

    this.players.set(player.id, player);
    return { success: true };
  };

  public removePlayer = (playerId: string) => {
    this.players.delete(playerId);
    return { success: true };
  };

  public getData = () => {
    return {
      roomCode: this.roomCode,
      players: Array.from(this.players.values()).map((p) => p.getData()),
      gameState: this.gameState,
    };
  };

  public getPlayers = () => {
    return Array.from(this.players.values()).map((p) => p.getData());
  };

  public getPlayer = (id: string) => {
    return this.players.get(id);
  };

  public getReadyPlayers = () => {
    return Array.from(this.players.values())
      .filter((p) => p.isReady())
      .map((p) => p.id);
  };

  public checkIfUserIsInRoom = (playerId: string) => {
    const playerData = this.players.get(playerId);
    const roomData = this.getData();

    if (!playerData || !roomData) {
      return { success: false, message: 'Your session has expired or the room no longer exists' };
    } else {
      return { success: true };
    }
  };
}
