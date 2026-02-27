import {GameStateType} from "./GameStateType";
import {PlayerType} from "./PlayerType";
import {MinigameEntryType} from "./RoomSettingsType";
import {TurnType} from "./TurnType";

export type ReturnDataType = {
  success: boolean;
  payload?: any;
};

export const JOIN_ROOM_STATUS = {
    SUCCESS: "SUCCESS",
    ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
    ROOM_FULL: "ROOM_FULL",
    ROOM_IN_GAME: "ROOM_IN_GAME",
    INTERNAL_ERROR: "INTERNAL_ERROR",
}

export type JoinRoomStatus =
    typeof JOIN_ROOM_STATUS[keyof typeof JOIN_ROOM_STATUS];

export type GameStateResponse =
    | (BaseGameStateResponse & { event?: undefined })
    | (BaseGameStateResponse & GameEvent)
    | null

export type BaseGameStateResponse = {
    gameState: GameStateType;
    endAt: number;
}

export type GameEvent =
    | { event: 'PLAYERS_UPDATE'; payload: PlayerType[]}
    | { event: 'MINIGAME_UPDATE'; payload: MinigamePayload}
    | { event: 'ANIMATION_UPDATE'; payload: AnimationPayload}

export type MinigamePayload =
    | { type: 'ROUND'; minigame: MinigameEntryType; value: number; durationMs: number, config: number[] }
    | { type: 'TURN'; minigame: MinigameEntryType; value: TurnType; durationMs: number };

type AnimationPayload =
    | { type: 'ROUND'; value: number; config: number[] }
    | { type: 'TURN'; value: TurnType;};
