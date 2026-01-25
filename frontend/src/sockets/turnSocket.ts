import { useTurnStore } from '@stores/turnStore.ts';
import { socket } from '@socket';
import { PlayerType, TurnType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';

let initialized = false;

export const initializeTurnSocket = () => {
  if (initialized) return;
  initialized = true;

  const handleChangeTurn = (turn: TurnType, players?: PlayerType[]) => {
    useTurnStore.getState().setTurn(turn);
    players && usePlayersStore.getState().setPlayers(players);
  };

  const handleTurnTimeout = (turn: TurnType, players: PlayerType[], endAt: number) => {
    usePlayersStore.getState().setPlayers(players);
    useTurnStore.getState().setTurn(turn);
    useTurnStore.getState().setTurnEndAt(endAt);
  };

  socket.on('got_turn', handleChangeTurn);
  socket.on('changed_turn', handleChangeTurn);
  socket.on('turn_timeout', handleTurnTimeout);
};
