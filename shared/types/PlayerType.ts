export type PlayerType = {
  id: string;
  nickname: string;
  isAlive: string; // boolean
  score: string; // number
  isHost: string; // boolean
  status: PlayerStatusEnum;
  selectedObjectId: string; // number
};

export enum PlayerStatusEnum {
  onilne = "online",
  offline = "offline",
}
