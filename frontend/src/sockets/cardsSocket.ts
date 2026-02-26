import { useEffect, useState } from 'react';
import { socket } from '@socket';
import { CardPlayersMapType, CARDS_GAME_STATUS, CardsGameStatus, GameStateType } from '@shared/types';
import { useRoomStore } from '@stores/roomStore.ts';
import { usePlayersStore } from '@stores/playersStore.ts';

export const useCardsSocket = () => {
  const [gameStatus, setGameStatus] = useState<CardsGameStatus>(CARDS_GAME_STATUS.CHOOSE);
  const [cards, setCards] = useState<number[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [cardPlayersMap, setCardPlayersMap] = useState<CardPlayersMapType>({});
  const players = usePlayersStore((state) => state.players);
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
      setTimeout(() => setCards(Array(Math.max(3, players.length - 1)).fill(0)), 400);
    }
  }, [roomData]);

  const handleRoundEnd = (gameState: GameStateType, endAt: number, gameData: { shuffledCards: number[]; playersMap: CardPlayersMapType }) => {
    updateGameState(gameState);
    setCards(gameData.shuffledCards);
    setSelectedCard(null);
    updateEndAt(endAt);
    setCardPlayersMap(gameData.playersMap);
  };

  const handleSelectCard = (cardId: number) => {
    if (gameStatus === CARDS_GAME_STATUS.REVEAL) return;

    setSelectedCard(cardId);
    socket.emit('player_selection', cardId);
  };

  return { gameStatus, cards, selectedCard, cardPlayersMap, handleSelectCard };
};
