import { PlayerStatusEnum } from '@shared/types';
import { avatars } from '@shared/constants/avatars';

export class Player {
  public readonly id: string;
  public readonly nickname: string;

  private disconnected: boolean;
  private readonly host: boolean;
  private alive: boolean;
  private score: number;
  private status: PlayerStatusEnum;
  private ready: boolean;
  public avatar: string;
  private selectedItem: number | null;

  constructor(id: string, nickname: string, isHost: boolean = false) {
    this.id = id;
    this.nickname = nickname;
    this.alive = true;
    this.score = 0;
    this.disconnected = false;
    this.status = PlayerStatusEnum.idle;
    this.avatar = 'default';
    this.ready = false;
    this.host = isHost;
    this.selectedItem = null;
  }

  public isAlive() {
    return this.alive;
  }

  public kill() {
    this.alive = false;
    this.status = PlayerStatusEnum.dead;
  }

  public isDisconnected() {
    return this.disconnected;
  }

  public disconnect() {
    this.disconnected = true;
  }

  public reconnect() {
    this.disconnected = false;
  }

  public revive() {
    this.alive = true;
    this.status = PlayerStatusEnum.idle;
  }

  public getScore() {
    return this.score;
  }

  public changeStatus(status: PlayerStatusEnum) {
    this.status = status;
  }

  public changeAvatar(avatar: avatars) {
    this.avatar = avatar;
  }

  public setReady(ready: boolean) {
    this.ready = ready;
  }

  public toggleReady() {
    this.ready = !this.ready;
  }

  public isReady() {
    return this.ready;
  }

  public isHost() {
    return this.host;
  }

  public addScore(score: number) {
    this.score = this.score + score < 0 ? 0 : this.score + score;
  }

  public subtractScore(score: number) {
    this.score = this.score - score <= 0 ? 0 : this.score - score;
  }

  public getData() {
    return {
      id: this.id,
      nickname: this.nickname,
      isAlive: this.alive,
      score: this.score,
      avatar: this.avatar,
      status: this.status,
      isDisconnected: this.disconnected,
      ready: this.ready,
      isHost: this.isHost(),
      selectedItem: this.selectedItem,
    };
  }

  public setSelectedItem(selectedItem: number | null) {
    this.selectedItem = selectedItem;
  }

  public getSelectedItem() {
    return this.selectedItem;
  }
}
