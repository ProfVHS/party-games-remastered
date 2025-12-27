import { PlayerType } from "./types";

export const sortPlayersByScore = (players: PlayerType[]) => {
    return [...players].sort((a, b) => b.score - a.score);
};