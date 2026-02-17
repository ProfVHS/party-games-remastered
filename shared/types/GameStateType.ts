import { RoomSettingsType } from "./RoomSettingsType";
import { MinigameNamesEnum } from "./MinigameType";

export enum GameStateType {
    Lobby = "LOBBY",
    Animation = "ANIMATION",
    Minigame = "MINIGAME",
    Leaderboard = "LEADERBOARD",
    Finished = "FINISHED",
}

export type LobbySessionDataType = {
    roomCode: string;
    gameState: GameStateType.Lobby;
    settings: RoomSettingsType;
};

type GameSessionDataType = {
    roomCode: string;
    gameState: GameStateType.Minigame;
    minigameId: string;
    minigameName: MinigameNamesEnum;
};

export type SessionDataType = LobbySessionDataType | GameSessionDataType;