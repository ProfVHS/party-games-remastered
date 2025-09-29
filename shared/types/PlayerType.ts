export type PlayerType = {
  id: string;
  nickname: string;
  isAlive: string; // boolean
  score: string; // number
  isHost: string; // boolean
  status: PlayerStatusEnum;
  selectedObjectId: string; // number
  avatar: string;
};

export enum PlayerStatusEnum {
  onilne = "online",
  offline = "offline",
}
