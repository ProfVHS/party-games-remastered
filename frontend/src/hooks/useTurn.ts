import { TurnType } from '@shared/types';
import { socket } from '@socket';
import { usePlayersStore } from '@stores/playersStore';
import { useEffect, useState } from 'react';

type useTurnProps = {
  onChangedTurn?: (newTurn: TurnType) => void;
  onGotTurn?: (newTurn: TurnType) => void;
};

export const useTurn = ({ onChangedTurn, onGotTurn }: useTurnProps) => {
  const [currentTurn, setCurrentTurn] = useState<TurnType | null>(null);
  const { currentPlayer, players } = usePlayersStore();

  useEffect(() => {
    socket.on('changed_turn', (newTurnData: TurnType) => {
      setCurrentTurn(() => newTurnData);
      onChangedTurn?.(newTurnData);
    });

    socket.on('got_turn', (turnIndex: number) => {
      const playerNickname = players[turnIndex].nickname;
      const playerId = players[turnIndex].id;
      const newTurnData = { id: turnIndex, player_id: playerId, nickname: playerNickname };

      setCurrentTurn(() => newTurnData);
      onGotTurn?.(newTurnData);
    });

    return () => {
      socket.off('changed_turn');
      socket.off('got_turn');
    };
  }, [players, onChangedTurn, onGotTurn]);

  useEffect(() => {
    if (currentPlayer?.isHost === 'true') {
      socket.emit('get_turn');
    }
  }, []);

  return currentTurn;
};
