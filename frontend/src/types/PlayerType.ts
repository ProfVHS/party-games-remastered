export type PlayerType = {
  id: string;
  data: PlayerDataType;
};

export type PlayerDataType = {
  nickname: string;
  score: number;
  isAlive: boolean;
};
