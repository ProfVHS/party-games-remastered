import { RoomSettingsType } from "./RoomSettingsType";
import {MinigameNamesEnum} from "./MinigameType";

export enum GameStateType {
  lobby = "lobby",
  playing = "playing",
  finished = "finished",
}

export type LobbySessionDataType = {
    gameState: GameStateType.lobby;
    roomSettings: RoomSettingsType;
    playerIdsReady: string[];
};

type GameSessionDataType = {
    gameState: GameStateType.playing;
    minigameId: string;
    minigameName: MinigameNamesEnum;
};

export type SessionDataType = LobbySessionDataType | GameSessionDataType;