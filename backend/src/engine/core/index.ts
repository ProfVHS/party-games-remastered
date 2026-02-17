import { GameStateType } from '@shared/types';

export const GAME_STATE_DURATION: Record<GameStateType, number> = {
  [GameStateType.Lobby]: 3000,
  [GameStateType.Animation]: 3000,
  [GameStateType.Minigame]: 3000,
  [GameStateType.Leaderboard]: 8000,
  [GameStateType.Finished]: 10000,
};
