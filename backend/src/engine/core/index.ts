import { GameStateType } from '@shared/types';
import { COUNTDOWN_FINISHED_MS } from '@shared/constants/gameRules';

export const GAME_STATE_DURATION: Record<GameStateType, number> = {
  [GameStateType.Lobby]: 3000,
  [GameStateType.Animation]: 3000,
  [GameStateType.Minigame]: 3000,
  [GameStateType.Leaderboard]: 8000,
  [GameStateType.Finished]: COUNTDOWN_FINISHED_MS,
};
