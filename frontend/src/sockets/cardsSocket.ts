import { useEffect, useState } from 'react';
import { socket} from '@socket';

const defaultCards: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

export const useCardsSocket = () => {
  const [gameStatus, setGameStatus] = useState<"Choose a card" | "Cards Reveal">("Choose a card");
  const [cards, setCards] = useState<number[]>(defaultCards);
  const [round, setRound] = useState<number>(1);
  const [showIntro, setShowIntro] = useState(false);
  const [flipCards, setFlipCards] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<number>(-100);

  useEffect(() => {
    socket.on('round_end', handleRoundEnd);
    socket.on('round_next', handleRoundNext);

    showIntroAnimation();

    return () => {
      socket.off('round_end', handleRoundEnd);
      socket.off('round_next', handleRoundNext);
    }
  }, [])

  const handleRoundEnd = (shuffledCards: number[]) => {
    setGameStatus("Cards Reveal");
    setFlipCards(true);
    setCards(shuffledCards);
    setSelectedCard(-100);
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
    //TODO: Socket selected
  }

  return { gameStatus, cards, round, showIntro, flipCards, selectedCard, handleSelectCard };
}