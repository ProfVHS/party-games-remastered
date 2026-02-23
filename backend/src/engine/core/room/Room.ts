import { GameStateType } from '@shared/types/GameStateType';
import { Player } from '@engine-core/Player';
import { COUNTDOWN, MAX_PLAYERS } from '@shared/constants/gameRules';
import { RoomSettings } from './RoomSettings';
import { BaseMinigame } from '@minigame-base/BaseMinigame';
import { avatars } from '@shared/constants/avatars';
import _ from 'lodash';
import { Timer } from '@engine/core/Timer';
import { GameStateResponse, MinigameEntryType, MinigamePayload } from '@shared/types';
import { RoomManager } from '@engine/managers/RoomManager';
import { RoundBasedMinigame } from '@minigame-base/RoundBasedMinigame';
import { TurnBasedMinigame } from '@minigame-base/TurnBasedMinigame';

class Room {
  public readonly roomCode: string;
  public readonly settings: RoomSettings;

  public players: Map<string, Player>;
  public currentMinigame: BaseMinigame | null;
  private gameState: GameStateType;

  private timer: Timer | null;
  private readonly timerOnEnd: (room: Room, finishedGameState: GameStateType, response: GameStateResponse) => void;
  private readonly setMinigame: (room: Room) => MinigameEntryType;

  constructor(
    roomCode: string,
    timerOnEnd: (room: Room, finishedGameState: GameStateType, response: GameStateResponse) => void,
    setMinigame: (room: Room) => MinigameEntryType,
  ) {
    this.roomCode = roomCode;
    this.players = new Map();
    this.gameState = GameStateType.Lobby;
    this.settings = new RoomSettings();
    this.currentMinigame = null;
    this.timer = null;
    this.timerOnEnd = timerOnEnd;
    this.setMinigame = setMinigame;
  }

  private startRoom() {
    if (this.settings.getMinigames().length <= 0) {
      this.settings.randomiseMinigames();
    }

    const availableAvatars = _.shuffle(Object.values(avatars).filter((avatar) => !this.getPlayers().some((p) => p.avatar == avatar)));

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

  private getMinigamePayload(minigame: MinigameEntryType): MinigamePayload {
    const durationMs = this.currentMinigame!.getCountdownDuration();

    if (this.currentMinigame instanceof RoundBasedMinigame) {
      return {
        type: 'ROUND',
        minigame,
        value: this.currentMinigame.getRound(),
        durationMs,
        config: this.currentMinigame.getGameConfig(),
      };
    }

    if (this.currentMinigame instanceof TurnBasedMinigame) {
      const { id, nickname } = this.currentMinigame.getCurrentTurnPlayer();
      return {
        type: 'TURN',
        minigame,
        value: { id, nickname },
        durationMs,
      };
    }

    throw new Error('Unsupported minigame type');
  }

  private onStateFinished() {
    let finishedGameState = this.gameState;
    let response: GameStateResponse | null = null;

    switch (this.gameState) {
      case GameStateType.Lobby:
        this.startRoom();
        this.setAllReady(false);

        const minigame = this.setMinigame(this);
        const payload = this.getMinigamePayload(minigame);

        if (this.settings.getData().isTutorialsEnabled) {
          this.setGameState(GameStateType.Tutorial);
          this.startTimer(COUNTDOWN.TUTORIAL_MS);
        } else {
          this.setGameState(GameStateType.MinigameIntro);
          this.startTimer(COUNTDOWN.MINIGAME_INTRO_MS);
        }

        response = { gameState: this.gameState, endAt: this.getTimer()!.getEndAt(), event: 'MINIGAME_UPDATE', payload: payload };
        break;
      case GameStateType.Tutorial:
        this.setGameState(GameStateType.MinigameIntro);
        this.startTimer(COUNTDOWN.MINIGAME_INTRO_MS);

        response = { gameState: this.gameState, endAt: this.getTimer()!.getEndAt() };
        break;
      case GameStateType.MinigameIntro:
        this.setGameState(GameStateType.Minigame);
        this.currentMinigame?.start();

        response = { gameState: this.gameState, endAt: this.currentMinigame?.getTimer()!.getEndAt() ?? 0 };
        break;
      case GameStateType.MinigameOutro:
        this.setGameState(GameStateType.Leaderboard);
        this.startTimer(COUNTDOWN.LEADERBOARD_MS);

        response = { gameState: this.gameState, endAt: this.getTimer()!.getEndAt(), event: 'PLAYERS_UPDATE', payload: this.getPlayers() };
        break;
      case GameStateType.Leaderboard:
        if (this.settings.isLastMinigame()) {
          this.setGameState(GameStateType.Finished);
          this.startTimer(COUNTDOWN.FINISHED_MS);

          response = { gameState: this.gameState, endAt: this.getTimer()!.getEndAt(), event: 'PLAYERS_UPDATE', payload: this.getPlayers() };
        } else {
          const minigame = this.setMinigame(this);

          this.setGameState(GameStateType.MinigameIntro);
          this.startTimer(COUNTDOWN.MINIGAME_INTRO_MS);

          const payload = this.getMinigamePayload(minigame);

          response = {
            gameState: this.gameState,
            endAt: this.getTimer()!.getEndAt(),
            event: 'MINIGAME_UPDATE',
            payload: payload,
          };
        }
        break;
      case GameStateType.Finished:
        RoomManager.deleteRoom(this.roomCode);
        break;
    }

    this.timerOnEnd(this, finishedGameState, response);
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

  public getAlivePlayers() {
    return Array.from(this.players.values()).map((p) => p.isAlive());
  }

  public getConnectedPlayers() {
    return Array.from(this.players.values()).map((p) => !p.isDisconnected());
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

export default Room;
