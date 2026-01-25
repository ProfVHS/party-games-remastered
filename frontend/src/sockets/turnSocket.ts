import { useTurnStore } from '@stores/turnStore.ts';
import { socket } from '@socket';
import { TurnType } from '@shared/types';

let initialized = false;

export const initializeTurnSocket = () => {
  if (initialized) return;
  initialized = true;

  const handler = (turn: TurnType) => {
    useTurnStore.getState().setTurn(turn);
  };

  socket.on('got_turn', handler);
  socket.on('changed_turn', handler);
};
