import { useEffect, useState } from 'react';
import { socket } from '@socket';
import { PlayerType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useRoomStore } from '@stores/roomStore.ts';

const defaultCards: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

export const useCardsSocket = () => {
  const [gameStatus, setGameStatus] = useState<'Choose a card' | 'Cards Reveal'>('Choose a card');
  const [cards, setCards] = useState<number[]>(defaultCards);
  const [flipCards, setFlipCards] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<number>(-100);
  const setPlayers = usePlayersStore((state) => state.setPlayers);
  const updateEndAt = useRoomStore((state) => state.updateEndAt);
  const roomData = useRoomStore((state) => state.roomData);

  useEffect(() => {
    socket.on('round_end', handleRoundEnd);

    return () => {
      socket.off('round_end', handleRoundEnd);
    };
  }, []);

  useEffect(() => {
    if (!roomData || !roomData.endAt || gameStatus === 'Choose a card') return;

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

  const handleRoundEnd = (endAt: number, players: PlayerType[], shuffledCards: number[]) => {
    setGameStatus('Cards Reveal');
    setFlipCards(true);
    setCards(shuffledCards);
    setSelectedCard(-100);
    setPlayers(players);
    updateEndAt(endAt);
  };

  const handleRoundNext = () => {
    setGameStatus('Choose a card');
    setFlipCards(false);
    setTimeout(() => setCards(defaultCards), 400);
  };

  const handleSelectCard = (cardId: number) => {
    if (gameStatus === 'Cards Reveal') return;

    setSelectedCard(cardId);
    socket.emit('player_selection', cardId);
  };

  return { gameStatus, cards, flipCards, selectedCard, handleSelectCard };
};
