import { PlayerStatusEnum } from '@shared/types';

export class Player {

  public readonly id: string;
  public readonly nickname: string;

  private disconnected: boolean;
  private readonly isHost: boolean;
  private alive: boolean;
  private score: number;
  private status: PlayerStatusEnum;
  private ready: boolean;
  private avatar: string;

  constructor(id: string, nickname: string, isHost: boolean = false) {
    this.id = id;
    this.nickname = nickname;
    this.alive = true;
    this.score = 0;
    this.disconnected = false;
    this.status = PlayerStatusEnum.idle;
    this.avatar = 'skeleton';
    this.ready = false;
    this.isHost = isHost;
  }

  public isAlive = () => {
    return this.alive;
  };

  public kill = () => {
    this.alive = false;
  };

  public isDisconnected = () => {
    return this.disconnected;
  };

  public disconnect = () => {
    this.disconnected = true;
  };

  public reconnect = () => {
    this.disconnected = false;
  };

  public revive = () => {
    this.alive = true;
  };

  public getScore = () => {
    return this.score;
  };

  public changeStatus(status: PlayerStatusEnum) {
    this.status = status;
  }

  public changeAvatar = (avatar: string) => {
    this.avatar = avatar;
  };

  public toggleReady = () => {
    this.ready = !this.ready;
  };

  public isReady = () => {
    return this.ready;
  };

  public addScore = (score: number) => {
    this.score = this.score + score < 0 ? 0 : this.score + score;
  };

  public substractScore = (score: number) => {
    this.score = this.score - score <= 0 ? 0 : this.score - score;
  };

  public getData = () => {
    return {
      id: this.id,
      nickname: this.nickname,
      isAlive: this.alive,
      score: this.score,
      avatar: this.avatar,
      status: this.status,
      isDisconnected: this.disconnected,
      ready: this.ready,
      isHost: this.isHost
    };
  };
}
