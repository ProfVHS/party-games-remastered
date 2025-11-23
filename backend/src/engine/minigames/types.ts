import { PlayerType, TurnType } from '@shared/types';

export type ClickTheBombEvent =
  | { type: 'CLICK_UPDATED'; clickCount: number; prizePool: number; prizePoolDelta: number }
  | { type: 'PLAYER_EXPLODED'; turnData: TurnType }
  | { type: 'TURN_CHANGED'; turnData: TurnType }
  | { type: 'GAME_ENDED'; players: PlayerType[] };
