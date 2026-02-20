import { GameStateType } from '@shared/types/GameStateType';
import { Player } from '@engine-core/Player';
import { MAX_PLAYERS } from '@shared/constants/gameRules';
import { RoomSettings } from './RoomSettings';
import { BaseMinigame } from '@minigame-base/BaseMinigame';
import { avatars } from '@shared/constants/avatars';
import _ from 'lodash';
import { Timer } from '@engine/core/Timer';

export class Room {
  public readonly roomCode: string;
  public readonly settings: RoomSettings;

  public players: Map<string, Player>;
  public currentMinigame: BaseMinigame | null;
  private gameState: GameStateType;

  private timer: Timer | null;
  private timerOnEnd: (room: Room, state: GameStateType) => void;

  constructor(roomCode: string, timerOnEnd: (room: Room, state: GameStateType) => void) {
    this.roomCode = roomCode;
    this.players = new Map();
    this.gameState = GameStateType.Lobby;
    this.settings = new RoomSettings();
    this.currentMinigame = null;
    this.timer = null;
    this.timerOnEnd = timerOnEnd;
  }

  private startRoom() {
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

  public getTimer() {
    return this.timer;
  }

  public startTimer(duration: number) {
    this.timer?.clear();

    console.log('Start TIMER for - ', this.gameState);

    this.timer = new Timer(duration, () => {
      this.onStateFinished();
    });
    this.timer.start();
  }

  public setGameState(state: GameStateType) {
    this.gameState = state;
  }

  private onStateFinished() {
    switch (this.gameState) {
      case GameStateType.Lobby:
        this.startRoom();
        break;
      case GameStateType.Animation:
        break;
      case GameStateType.Leaderboard:
        break;
    }

    this.timerOnEnd(this, this.gameState);
  }

  public getGameState() {
    return this.gameState;
  }

  public addPlayer(player: Player) {
    if (this.players.size >= MAX_PLAYERS) {
      return { success: false, message: 'Room is full!' };
    }

    this.players.set(player.id, player);
    return { success: true };
  }

  public removePlayer(playerId: string) {
    this.players.delete(playerId);
    return { success: true };
  }

  public getData() {
    return {
      roomCode: this.roomCode,
      gameState: this.gameState,
    };
  }

  public getPlayers() {
    return Array.from(this.players.values()).map((p) => p.getData());
  }

  public getPlayer(id: string) {
    return this.players.get(id);
  }

  public getReadyPlayers() {
    return Array.from(this.players.values())
      .filter((p) => p.isReady())
      .map((p) => p.id);
  }

  public setAllReady(ready: boolean) {
    this.players.forEach((player) => {
      player.setReady(ready);
    });
  }

  public checkIfUserIsInRoom(playerId: string) {
    const playerData = this.players.get(playerId);
    const roomData = this.getData();

    if (!playerData || !roomData) {
      return { success: false, message: 'Your session has expired or the room no longer exists' };
    } else {
      return { success: true };
    }
  }
}
