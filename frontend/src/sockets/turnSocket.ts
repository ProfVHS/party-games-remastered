import { useGameStore } from '@stores/gameStore.ts';
import { socket } from '@socket';
import { PlayerType, TurnType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';

let initialized = false;

export const initializeTurnSocket = () => {
  if (initialized) return;
  initialized = true;

  //TODO: Remove unused endAt
  const handler = (turn: TurnType, players?: PlayerType[], endAt?: number) => {
    useGameStore.getState().setTurn(turn);
    players && usePlayersStore.getState().setPlayers(players);
    endAt && useGameStore.getState().setTurnEndAt(endAt);
  };

  socket.on('got_turn', handler);
  socket.on('changed_turn', handler);
  socket.on('turn_timeout', handler);
};
