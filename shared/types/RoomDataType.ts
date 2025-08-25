export type RoomDataType = {
  roomCode: string;
  maxRounds: string; // number
  currentRound: string; // number
  currentTurn: string; // number
  status: RoomStatusEnum;
};

export enum RoomStatusEnum {
  lobby = "lobby",
  game = "game",
}
