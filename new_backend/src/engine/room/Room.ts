import { GameStateType } from '../../types/gameStateType';
import { Player } from '../Player';
import { MAX_PLAYERS } from '@shared/constants/gameRules';
import { RoomSettings } from './RoomSettings';
import { MinigameEntryType } from '@shared/types/RoomSettingsType';
import { BaseMinigame } from '../minigame/BaseMinigame';
import { MINIGAME_REGISTRY } from '../minigame';

export class Room {
  public readonly roomCode: string;
  public players: Map<string, Player>;
  private gameState: GameStateType;
  public settings: RoomSettings;
  public currentMinigame: BaseMinigame | null;

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
      gameState: this.gameState
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

  public randomiseMinigames = () => {
    const settings = this.settings;
    if (!settings.isRandomMinigames) return { success: false, message: 'Random minigames is disabled!' };
    if (settings.numberOfMinigames < 2)
      return {
        success: false,
        message: 'Number of Minigames must be greater than 2!'
      };

    let allMinigames = Object.keys(MINIGAME_REGISTRY);
    const minigames: MinigameEntryType[] = [];

    for (let i = 0; i < settings.numberOfMinigames; i++) {
      const index = Math.floor(Math.random() * allMinigames.length);
      minigames.push({ name: allMinigames[index] });

      if (allMinigames.length === 1) {
        allMinigames = Object.keys(MINIGAME_REGISTRY);
      } else {
        allMinigames.splice(index, 1);
      }
    }

    this.settings.minigames = minigames;
  };
}
