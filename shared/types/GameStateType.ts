import { MinigameNamesEnum } from "./MinigameType";

export enum GameStateType {
    Lobby = "LOBBY",
    Tutorial = "TUTORIAL",
    MinigameIntro = "MINIGAME_INTRO",
    Minigame = "MINIGAME",
    MinigameOutro = "MINIGAME_OUTRO",
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