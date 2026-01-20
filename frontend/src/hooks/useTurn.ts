import { TurnType } from '@shared/types';
import { socket } from '@socket';
import { usePlayersStore } from '@stores/playersStore';
import { useEffect, useState } from 'react';

type useTurnProps = {
  onChangedTurn?: (newTurn: TurnType) => void;
  onGotTurn?: (newTurn: TurnType) => void;
};

export const useTurn = ({ onChangedTurn, onGotTurn }: useTurnProps = {}) => {
  const [currentTurn, setCurrentTurn] = useState<TurnType | null>(null);
  const { currentPlayer, players } = usePlayersStore();

  const handleTurnChanged = (turn: TurnType) => {
    setCurrentTurn(turn);
    onChangedTurn?.(turn);
  };

  const handleGotTurn = (turnIndex: number) => {
    const playerNickname = players[turnIndex].nickname;
    const playerId = players[turnIndex].id;
    const turn: TurnType = { id: turnIndex, player_id: playerId, nickname: playerNickname };

    console.log('turn', turn);
    setCurrentTurn(turn);
    onGotTurn?.(turn);
  };

  useEffect(() => {
    socket.on('changed_turn', handleTurnChanged);
    socket.on('got_turn', handleGotTurn);

    return () => {
      socket.off('changed_turn', handleTurnChanged);
      socket.off('got_turn', handleGotTurn);
    };
  }, [players]);

  useEffect(() => {
    if (currentPlayer?.isHost) {
      socket.emit('get_turn');
    }
  }, []);

  const isMyTurn = currentTurn?.player_id === currentPlayer?.id;

  return { currentTurn, isMyTurn };
};
