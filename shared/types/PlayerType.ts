export type PlayerType = {
  id: string;
  nickname: string;
  isAlive: boolean;
  score: number;
  isHost: boolean;
  isDisconnected: boolean;
  status: PlayerStatusEnum;
  selectedObjectId: number;
  avatar: string;
};

export enum PlayerStatusEnum {
  idle = "idle",
  happy = "happy",
  dead = "dead",
  sleeping = "sleeping",
}
