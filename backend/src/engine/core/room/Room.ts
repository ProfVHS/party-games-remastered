import { GameStateType } from '@shared/types/GameStateType';
import { Player } from '@engine-core/Player';
import { MAX_PLAYERS } from '@shared/constants/gameRules';
import { RoomSettings } from './RoomSettings';
import { BaseMinigame } from '@minigame-base/BaseMinigame';
import { Timer } from '@engine/core/Timer';
import { avatars } from '@shared/constants/avatars';
import _ from 'lodash';

export class Room {
  public readonly roomCode: string;
  public readonly settings: RoomSettings;

  public players: Map<string, Player>;
  public currentMinigame: BaseMinigame | null;
  private gameState: GameStateType;

  private startTimer: Timer | null = null;
  private minigameStarted = false;

  constructor(roomCode: string) {
    this.roomCode = roomCode;
    this.players = new Map();
    this.gameState = GameStateType.lobby;
    this.settings = new RoomSettings();
    this.currentMinigame = null;
  }

  public startRoom() {
    this.gameState = GameStateType.game;

    if (this.settings.getMinigames().length <= 0) {
      this.settings.randomiseMinigames();
    }

    const availableAvatars = _.shuffle(Object.values(avatars).filter((avatar) => !Array.from(this.players.values()).some((p) => p.avatar == avatar)));

    let i = 0;

    Array.from(this.players.values()).forEach((player) => {
      if (player.avatar === 'default') {
        player.avatar = availableAvatars[i++];
      }
    });
  }

  public endRoom() {
    this.gameState = GameStateType.finished;
  }

  public scheduleStart(duration: number, onStart: () => void) {
    if (this.minigameStarted) return;

    if (this.startTimer) {
      this.startTimer.clear();
    }

    this.startTimer = new Timer(duration, () => {
      if (this.minigameStarted) return;

      this.minigameStarted = true;
      this.startTimer = null;

      onStart();
    });

    this.startTimer.start();
  }

  public setMinigameStarted(started: boolean) {
    this.minigameStarted = started;
  }

  public getMinigameStarted(): boolean {
    return this.minigameStarted;
  }

  public getGameState() {
    return this.gameState;
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
      settings: this.settings,
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

  public setAllReady(ready: boolean) {
    this.players.forEach((player) => {
      player.setReady(ready);
    });
  }

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
