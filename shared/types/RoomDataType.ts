import {GameStateType} from "./GameStateType";

export type RoomDataType = {
  roomCode: string;
  gameState: GameStateType;
  endAt: number;
};
