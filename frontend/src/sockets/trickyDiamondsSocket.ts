import { useEffect, useState } from 'react';
import { socket } from '@socket';
import { GameStateType, PlayerType, TRICKY_DIAMONDS_GAME_STATUS, TrickyDiamondsGameStatus } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';
import { DiamondType } from '@shared/types';
import { useRoomStore } from '@stores/roomStore.ts';

export const useTrickyDiamondsSocket = () => {
  const [selectedDiamond, setSelectedDiamond] = useState<number | null>();
  const [diamonds, setDiamonds] = useState<DiamondType[]>([
    { id: 0, players: [], won: false },
    { id: 1, players: [], won: false },
    { id: 2, players: [], won: false },
  ]);
  const [gameStatus, setGameStatus] = useState<TrickyDiamondsGameStatus>(TRICKY_DIAMONDS_GAME_STATUS.CHOOSE);
  const [reveal, setReveal] = useState<boolean>(false);
  const setPlayers = usePlayersStore((state) => state.setPlayers);
  const updateGameState = useRoomStore((state) => state.updateGameState);
  const updateEndAt = useRoomStore((state) => state.updateEndAt);
  const roomData = useRoomStore((state) => state.roomData);

  useEffect(() => {
    socket.on('round_end', handleRoundEnd);

    return () => {
      socket.off('round_end', handleRoundEnd);
    };
  }, []);

  useEffect(() => {
    if (!roomData || !roomData.endAt || gameStatus === TRICKY_DIAMONDS_GAME_STATUS.CHOOSE) return;

    const now = Date.now();
    const timeLeft = roomData.endAt - now;

    if (timeLeft <= 0) {
      handleRoundNext();
      return;
    }

    const timer = setTimeout(() => {
      handleRoundNext();
    }, timeLeft);

    return () => clearTimeout(timer);
  }, [roomData]);

  const handleRoundEnd = (gameState: GameStateType, endAt: number, players: PlayerType[], diamonds: DiamondType[]) => {
    updateGameState(gameState);
    updateEndAt(endAt);
    setGameStatus(TRICKY_DIAMONDS_GAME_STATUS.REVEAL);
    setReveal(true);
    setSelectedDiamond(null);
    setDiamonds(diamonds);
    setPlayers(players);
  };

  const handleRoundNext = () => {
    setGameStatus(TRICKY_DIAMONDS_GAME_STATUS.CHOOSE);
    setReveal(false);
    setSelectedDiamond(null);
  };

  const handleSelectDiamond = (diamondId: number) => {
    if (reveal) return;

    setSelectedDiamond(diamondId);
    socket.emit('player_selection', diamondId);
  };

  return { diamonds, reveal, gameStatus, selectedDiamond, handleSelectDiamond };
};
