import {RoomSettingsType} from "./RoomSettingsType";
import {GameStateType} from "./GameStateType";

export type RoomDataType = {
  roomCode: string;
  settings: RoomSettingsType;
  gameState: GameStateType;
};
