export type RoomDataType = {
  roomCode: string;
  maxRounds: number;
  currentRound: number;
  currentTurn: number;
  status: RoomStatusEnum;
  minigameIndex: number;
};

export enum RoomStatusEnum {
  lobby = 'lobby',
  game = 'game',
  leaderboard = 'leaderboard',
}
