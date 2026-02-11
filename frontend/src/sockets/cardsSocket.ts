import { useEffect, useState } from 'react';
import { socket} from '@socket';
import { PlayerType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';

const defaultCards: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

export const useCardsSocket = () => {
  const [gameStatus, setGameStatus] = useState<"Choose a card" | "Cards Reveal">("Choose a card");
  const [cards, setCards] = useState<number[]>(defaultCards);
  const [round, setRound] = useState<number>(1);
  const [showIntro, setShowIntro] = useState(false);
  const [flipCards, setFlipCards] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<number>(-100);
  const setPlayers = usePlayersStore((state) => state.setPlayers);

  useEffect(() => {
    socket.on('round_end', handleRoundEnd);
    socket.on('round_next', handleRoundNext);

    showIntroAnimation();

    return () => {
      socket.off('round_end', handleRoundEnd);
      socket.off('round_next', handleRoundNext);
    }
  }, [])

  const handleRoundEnd = (shuffledCards: number[], players: PlayerType[]) => {
    setGameStatus("Cards Reveal");
    setFlipCards(true);
    setCards(shuffledCards);
    setSelectedCard(-100);
    setPlayers(players);
  }

  const handleRoundNext = (nextRound: number) => {
    setGameStatus("Choose a card");
    setFlipCards(false);
    setTimeout(() => setCards(defaultCards), 400);
    setRound(nextRound);
    showIntroAnimation();
  }

  const showIntroAnimation = () => {
    setShowIntro(true);

    setTimeout(() => {
      setShowIntro(false);
    }, 2000)
  }

  const handleSelectCard = (cardId: number) => {
    if (gameStatus === "Cards Reveal") return;

    setSelectedCard(cardId);
    socket.emit('player_selection', cardId);
  }

  return { gameStatus, cards, round, showIntro, flipCards, selectedCard, handleSelectCard };
}