export type RoomDataType = {
  roomCode: string;
  maxRounds: string; // number
  currentRound: string; // number
  currentTurn: string; // number
  status: RoomStatusEnum;
  minigameIndex: string; // number
  roomSettings: string;
};

export enum RoomStatusEnum {
  lobby = "lobby",
  game = "game",
  leaderboard = "leaderboard",
}
