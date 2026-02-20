import { GameStateType } from '@shared/types';
import {
  COUNTDOWN_ANIMATION_MS,
  COUNTDOWN_FINISHED_MS,
  COUNTDOWN_LEADERBOARD_MS,
  COUNTDOWN_LOBBY_MS,
  COUNTDOWN_MINIGAME_MS,
  COUNTDOWN_TUTORIAL_MS,
} from '@shared/constants/gameRules';

export const GAME_STATE_DURATION: Record<GameStateType, number> = {
  [GameStateType.Lobby]: COUNTDOWN_LOBBY_MS,
  [GameStateType.Tutorial]: COUNTDOWN_TUTORIAL_MS,
  [GameStateType.Animation]: COUNTDOWN_ANIMATION_MS,
  [GameStateType.Minigame]: COUNTDOWN_MINIGAME_MS,
  [GameStateType.Leaderboard]: COUNTDOWN_LEADERBOARD_MS,
  [GameStateType.Finished]: COUNTDOWN_FINISHED_MS,
};
