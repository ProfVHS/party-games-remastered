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
    if (roomData?.gameState === GameStateType.Minigame) {
      setGameStatus(TRICKY_DIAMONDS_GAME_STATUS.CHOOSE);
    }
    if (roomData?.gameState === GameStateType.MinigameOutro) {
      setGameStatus(TRICKY_DIAMONDS_GAME_STATUS.REVEAL);
    }
    if (roomData?.gameState === GameStateType.MinigameIntro) {
      setGameStatus(TRICKY_DIAMONDS_GAME_STATUS.CHOOSE);
      setSelectedDiamond(null);
    }
  }, [roomData]);

  const handleRoundEnd = (gameState: GameStateType, endAt: number, players: PlayerType[], diamonds: DiamondType[]) => {
    updateGameState(gameState);
    updateEndAt(endAt);
    setSelectedDiamond(null);
    setDiamonds(diamonds);
    setPlayers(players);
  };

  const handleSelectDiamond = (diamondId: number) => {
    if (gameStatus !== TRICKY_DIAMONDS_GAME_STATUS.CHOOSE) return;

    setSelectedDiamond(diamondId);
    socket.emit('player_selection', diamondId);
  };

  return { diamonds, gameStatus, selectedDiamond, handleSelectDiamond };
};
