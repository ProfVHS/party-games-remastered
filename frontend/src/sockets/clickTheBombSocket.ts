import { useEffect, useState } from 'react';
import { RandomScoreBoxType } from '@frontend-types/RandomScoreBoxType.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import { socket } from '@socket';
import { useTurnStore } from '@stores/turnStore.ts';
import { PlayerType, TurnType } from '@shared/types';

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

  const isMyTurn = useTurnStore((state) => state.isMyTurn);
  const setTurn = useTurnStore((state) => state.setTurn);
  const setTurnEndAt = useTurnStore((state) => state.setTurnEndAt);
  const currentPlayer = usePlayersStore((state) => state.currentPlayer);
  const setPlayers = usePlayersStore((state) => state.setPlayers);

  const resetPrizePool = () => setGameState(prevState => ({...prevState, prizePool: 0}));

  useEffect(() => {
    socket.on('ended_minigame', bombExploded);
    socket.on('show_score', handleShowScore);
    socket.on('turn_timeout', handleTurnTimeout);
    socket.on('player_exploded', handlePlayerExplode);
    socket.on('changed_turn', resetPrizePool);

    socket.emit('start_minigame_queue');

    return () => {
      socket.off('ended_minigame', bombExploded);
      socket.off('show_score', handleShowScore);
      socket.off('turn_timeout', handleTurnTimeout);
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
    setTurnEndAt(turnEndAt);
    if (isMyTurn) {
      setCanSkipTurn(true);
    }
  };

  const handleTurnTimeout = (turn: TurnType, players: PlayerType[], turnEndAt: number) => {
    setTurn(turn);
    setPlayers(players);
    setLoading(false);
    setGameState((prev) => ({ ...prev, prizePool: 0 }));
    setTurnEndAt(turnEndAt);
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
  };

  const nextTurn = () => {
    setCanSkipTurn(false);
    socket.emit('change_turn');
  };

  return { bombClick, nextTurn, gameState, canSkipTurn, exploded, scoreData, setExploded };
};
