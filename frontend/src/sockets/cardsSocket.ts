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
    if (!roomData || !roomData.endAt || gameStatus === CARDS_GAME_STATUS.CHOOSE) return;

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
  }, [roomData, gameStatus]);

  const handleRoundEnd = (gameState: GameStateType, endAt: number, players: PlayerType[], shuffledCards: number[]) => {
    updateGameState(gameState);
    setGameStatus(CARDS_GAME_STATUS.REVEAL);
    setCards(shuffledCards);
    setSelectedCard(null);
    setPlayers(players);
    updateEndAt(endAt);
  };

  const handleRoundNext = () => {
    setGameStatus(CARDS_GAME_STATUS.CHOOSE);
    setTimeout(() => setCards(defaultCards), 400);
  };

  const handleSelectCard = (cardId: number) => {
    if (gameStatus === CARDS_GAME_STATUS.REVEAL) return;

    setSelectedCard(cardId);
    socket.emit('player_selection', cardId);
  };

  return { gameStatus, cards, selectedCard, handleSelectCard };
};
