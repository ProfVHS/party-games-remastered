export type PlayerType = {
  id: string;
  nickname: string;
  isAlive: string; // boolean
  score: string; // number
  isHost: string; // boolean
  isDisconnected: string; // boolean
  status: PlayerStatusEnum;
  selectedObjectId: string; // number
  avatar: string;
};

export enum PlayerStatusEnum {
  idle = "idle",
  happy = "happy",
  dead = "dead",
  sleeping = "sleeping",
}
