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
    endAt: number;
};

type GameSessionDataType = {
    roomCode: string;
    gameState: GameStateType.Minigame;
    minigameId: string;
    minigameName: MinigameNamesEnum;
};

export type SessionDataType = LobbySessionDataType | GameSessionDataType;