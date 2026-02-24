import { useEffect, useState } from 'react';
import { socket } from '@socket';
import { CARDS_GAME_STATUS, CardsGameStatus, GameStateType, PlayerType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useRoomStore } from '@stores/roomStore.ts';

const defaultCards: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

export const useCardsSocket = () => {
  const [gameStatus, setGameStatus] = useState<CardsGameStatus>(CARDS_GAME_STATUS.CHOOSE);
  const [cards, setCards] = useState<number[]>(defaultCards);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
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
      setGameStatus(CARDS_GAME_STATUS.CHOOSE);
    }
    if (roomData?.gameState === GameStateType.MinigameOutro) {
      setGameStatus(CARDS_GAME_STATUS.REVEAL);
    }
    if (roomData?.gameState === GameStateType.MinigameIntro) {
      setGameStatus(CARDS_GAME_STATUS.CHOOSE);
      setCards(defaultCards);
    }
  }, [roomData]);

  const handleRoundEnd = (gameState: GameStateType, endAt: number, players: PlayerType[], shuffledCards: number[]) => {
    updateGameState(gameState);
    setCards(shuffledCards);
    setSelectedCard(null);
    setPlayers(players);
    updateEndAt(endAt);
  };

  const handleSelectCard = (cardId: number) => {
    if (gameStatus === CARDS_GAME_STATUS.REVEAL) return;

    setSelectedCard(cardId);
    socket.emit('player_selection', cardId);
  };

  return { gameStatus, cards, selectedCard, handleSelectCard };
};
