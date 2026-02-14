import { RoomSettingsType } from "./RoomSettingsType";
import {MinigameNamesEnum} from "./MinigameType";

export enum GameStateType {
  lobby = "lobby",
  game = "game",
  finished = "finished",
}

export type LobbySessionDataType = {
    roomCode: string;
    gameState: GameStateType.lobby;
    settings: RoomSettingsType;
};

type GameSessionDataType = {
    roomCode: string;
    gameState: GameStateType.game;
    minigameId: string;
    minigameName: MinigameNamesEnum;
};

export type SessionDataType = LobbySessionDataType | GameSessionDataType;