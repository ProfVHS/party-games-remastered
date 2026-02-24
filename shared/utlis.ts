import { PlayerType } from "./types";

export const sortPlayersByScore = (players: PlayerType[]) => {
    return [...players].sort((a, b) => b.score - a.score);
};

export const formatTime = (endAt: number | undefined) => {
    if (!endAt) return;

    const d = new Date(endAt);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}:${d.getMilliseconds().toString().padStart(3, '0')}`;
};
