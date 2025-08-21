import './Cards.scss';
import { useEffect, useState, useRef } from 'react';
import { Card } from './Card';
import { socket } from '../../../socket';
import { usePlayersStore } from '../../../stores/playersStore';
import { PlayerType } from '../../../types/PlayerType';

const countdownDuration = 5;

export const Cards = () => {
  const [gameStatus, setGameStatus] = useState<string>('Choose a card');
  const [cards, setCards] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(countdownDuration);
  const [newPlayersPoints, setNewPlayerPoints] = useState<PlayerType[]>([]);
  const { currentPlayer } = usePlayersStore();
  const currentRound = useRef<string>('1');
  const hasStarted = useRef<boolean>(false);

  const handleCardSelect = (id: number) => {
    // Player can only select a card if the countdown is running
    if (countdown <= 0 || hasStarted.current) return;

    socket.emit('card_select', id);
    setSelectedCard(() => id);
  };

  const startNewRound = () => {
    if (currentRound.current === '3') {
      console.log('Game Over');
      return;
    }

    // Reset the game state for a new round
    setTimeout(() => {
      setIsFlipping(false);

      setTimeout(() => {
        setCountdown(countdownDuration);
        setCards([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        setNewPlayerPoints([]);
        setGameStatus('Choose a card');
        hasStarted.current = false;
      }, 400);
    }, 400);
  };

  // Countdown logic to manage the game state
  useEffect(() => {
    if (countdown <= 0) {
      if (currentPlayer?.isHost === 'true' && !hasStarted.current) socket.emit('cards_round_end');
      hasStarted.current = true;
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Socket listener for card selection
  useEffect(() => {
    const handleCardsRoundEnded = (newCards: number[], newPlayersPoints: PlayerType[], round: string) => {
      currentRound.current = round;
      setCards(() => newCards);
      setNewPlayerPoints(() => newPlayersPoints);
      setSelectedCard(() => null);
      setIsFlipping(() => true);
      setGameStatus('Cards reveal');
    };

    socket.on('cards_round_ended', handleCardsRoundEnded);

    return () => {
      socket.off('cards_round_ended', handleCardsRoundEnded);
    };
  }, []);

  return (
    <div className="cards">
      <div className="cards__countdown">{countdown}</div>
      <div className="cards__status">{gameStatus}</div>
      <div className="cards__content">
        {cards.map((card, index) => (
          <Card
            key={index}
            id={index}
            points={card}
            isPositive={card < 0 ? false : true}
            isFlipping={isFlipping}
            selected={selectedCard === index}
            newPlayersPointsCard={newPlayersPoints.filter((player) => player.selectedObjectId == index.toString())}
            onClick={handleCardSelect}
            startNewRound={index === 8 ? startNewRound : undefined}
          />
        ))}
      </div>
    </div>
  );
};
