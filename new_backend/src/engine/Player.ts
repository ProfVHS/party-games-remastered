import { PlayerStatusEnum } from '@shared/types';

export class Player {
  public id: string;
  public nickname: string;
  public isAlive: boolean;
  public score: number;
  public isDisconnected: boolean;
  public status: PlayerStatusEnum;
  public avatar: string;
  public ready: boolean;
  public isHost: boolean;

  constructor(id: string, nickname: string, isHost: boolean = false) {
    this.id = id;
    this.nickname = nickname;
    this.isAlive = true;
    this.score = 0;
    this.isDisconnected = false;
    this.status = PlayerStatusEnum.idle;
    this.avatar = 'skeleton';
    this.ready = false;
    this.isHost = isHost;
  }

  public getData = () => {
    return {
      id: this.id,
      nickname: this.nickname,
      isAlive: this.isAlive,
      score: this.score,
      avatar: this.avatar,
      status: this.status,
      isDisconnected: this.isDisconnected,
      ready: this.ready,
      isHost: this.isHost,
    };
  };

  public toggleReady = () => {
    this.ready = !this.ready;
  };
}
