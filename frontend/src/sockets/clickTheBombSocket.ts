import { useEffect, useState } from 'react';
import { RandomScoreBoxType } from '@frontend-types/RandomScoreBoxType.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import { socket } from '@socket';
import { useGameStore } from '@stores/gameStore.ts';
import { PlayerType, TurnType } from '@shared/types';
import { useRoomStore } from '@stores/roomStore.ts';

type GameState = {
  clickCount: number;
  prizePool: number;
};

const defaultGameState = {
  clickCount: 0,
  prizePool: 0,
};

export const useClickTheBombSocket = () => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [canSkipTurn, setCanSkipTurn] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();
  const [scoreData, setScoreData] = useState<RandomScoreBoxType>({ id: 0, score: 0 });
  const [exploded, setExploded] = useState<boolean>(false);

  const isMyTurn = useGameStore((state) => state.isMyTurn);
  const currentPlayer = usePlayersStore((state) => state.currentPlayer);
  const setTurn = useGameStore((state) => state.setTurn);
  const updateEndAt = useRoomStore((state) => state.updateEndAt);
  const setPlayers = usePlayersStore((state) => state.setPlayers);

  const resetPrizePool = (newTurn: TurnType, players: PlayerType[], endAt: number) => {
    setGameState((prevState) => ({ ...prevState, prizePool: 0 }));
    setTurn(newTurn);
    setPlayers(players);
    updateEndAt(endAt);
  };

  useEffect(() => {
    socket.on('show_score', handleShowScore);
    socket.on('player_exploded', handlePlayerExplode);
    socket.on('changed_turn', resetPrizePool);

    return () => {
      socket.off('show_score', handleShowScore);
      socket.off('player_exploded', handlePlayerExplode);
      socket.off('changed_turn', resetPrizePool);
    };
  }, []);

  useEffect(() => {
    socket.on('updated_click_count', handleUpdateGameState);

    return () => {
      socket.off('updated_click_count', handleUpdateGameState);
    };
  }, [isMyTurn]);

  const handleShowScore = (scoreDelta: number) => {
    setScoreData((prev) => ({ id: (prev?.id ?? 0) + 1, score: scoreDelta }));
  };

  const handleUpdateGameState = (clickCount: number, prizePool: number, turnEndAt: number) => {
    setLoading(false);
    setGameState({ clickCount, prizePool });
    updateEndAt(turnEndAt);
    if (isMyTurn) {
      setCanSkipTurn(true);
    }
  };

  const handlePlayerExplode = (nextTurn: TurnType) => {
    bombExploded();
    setTurn(nextTurn);
  };

  const bombClick = () => {
    if (loading || !isMyTurn || !currentPlayer?.isAlive) return;

    setLoading(true);
    socket.emit('bomb_click');
  };

  const bombExploded = () => {
    setLoading(false);
    setExploded(true);
    setGameState(defaultGameState);
    updateEndAt(0);
  };

  const nextTurn = () => {
    setCanSkipTurn(false);
    socket.emit('change_turn');
  };

  return { bombClick, nextTurn, gameState, canSkipTurn, exploded, scoreData, setExploded };
};
