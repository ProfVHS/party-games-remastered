import { useTurnStore } from '@stores/turnStore.ts';
import { socket } from '@socket';
import { PlayerType, TurnType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';

let initialized = false;

export const initializeTurnSocket = () => {
  if (initialized) return;
  initialized = true;

  const handler = (turn: TurnType, players?: PlayerType[], endAt?: number) => {
    useTurnStore.getState().setTurn(turn);
    players && usePlayersStore.getState().setPlayers(players);
    endAt && useTurnStore.getState().setTurnEndAt(endAt);
  };

  socket.on('got_turn', handler);
  socket.on('changed_turn', handler);
  socket.on('turn_timeout', handler);
};
