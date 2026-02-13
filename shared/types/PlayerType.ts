export type PlayerType = {
  id: string;
  nickname: string;
  isAlive: boolean;
  score: number;
  isHost: boolean;
  isDisconnected: boolean;
  status: PlayerStatusEnum;
  selectedItem: number;
  avatar: string;
  ready: boolean;
};

export enum PlayerStatusEnum {
  idle = "idle",
  happy = "happy",
  dead = "dead",
  sleeping = "sleeping",
}
