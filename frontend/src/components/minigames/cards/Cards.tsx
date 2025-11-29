import './Cards.scss';
import { useEffect, useRef, useState } from 'react';
import { Card } from './Card';
import { socket } from '@socket';
import { PlayerType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';
import { Stopwatch } from '@components/ui/stopwatch/Stopwatch.tsx';
import { useCountdownAnimation } from '@hooks/useCountdownAnimation.ts';
import { CARDS_RULES } from '@shared/constants/gameRules.ts';
import { delay } from '@utils';

type CardsProps = {
  startGame: boolean;
};

export const Cards = ({ startGame }: CardsProps) => {
  const roundIntroDuration = 2000;
  const cardFlipHalfDuration = 400;

  const [gameStatus, setGameStatus] = useState<string>('Choose a card');
  const [isRoundIntroVisible, setIsRoundIntroVisible] = useState<boolean>(false);

  const [cards, setCards] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [newPlayersPoints, setNewPlayerPoints] = useState<PlayerType[]>([]);

  const { animationTimeLeft, startCountdownAnimation } = useCountdownAnimation(CARDS_RULES.COUNTDOWN, () => endRound());
  const { currentPlayer } = usePlayersStore();

  const currentRound = useRef<number>(1);
  const hasStarted = useRef<boolean>(false);

  const handleCardSelect = (id: number) => {
    if (animationTimeLeft <= 0 || hasStarted.current) return; // Player can only select a card if the stopwatch is running

    socket.emit('card_select', id);
    setSelectedCard(() => id);
  };

  const showRoundIntro = async () => {
    setIsRoundIntroVisible(true);
    await delay(roundIntroDuration);
    setIsRoundIntroVisible(false);
  };

  const startNewRound = async () => {
    if (currentRound.current === 4) {
      if (currentPlayer?.isHost) socket.emit('end_minigame');
      return;
    }

    await showRoundIntro();

    setIsFlipping(false);
    await delay(cardFlipHalfDuration);

    // Reset the game state for a new round
    setCards([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    setNewPlayerPoints([]);
    setGameStatus('Choose a card');
    startCountdownAnimation();
    hasStarted.current = false;
  };

  const endRound = () => {
    if (hasStarted.current) return;
    socket.emit('end_round_queue');
    hasStarted.current = true;
  };

  useEffect(() => {
    socket.on('cards_round_ended', (newCards: number[], newPlayersPoints: PlayerType[], round: number) => {
      currentRound.current = round;
      setCards(() => newCards);
      setNewPlayerPoints(() => newPlayersPoints);
      setSelectedCard(() => null);
      setIsFlipping(() => true);
      setGameStatus('Cards reveal');
    });

    return () => {
      socket.off('cards_round_ended');
    };
  }, []);

  useEffect(() => {
    if (!startGame) return;
    startNewRound();
  }, [startGame]);

  return (
    <div className="cards">
      <div className={`cards__round ${isRoundIntroVisible ? 'visible' : ''}`}>Round {currentRound.current}</div>
      <div className="cards__countdown">
        <Stopwatch timeLeft={animationTimeLeft} duration={CARDS_RULES.COUNTDOWN} />
      </div>
      <div className="cards__status">{gameStatus}</div>
      <div className="cards__content">
        {cards.map((card, index) => (
          <Card
            key={index}
            id={index}
            points={card}
            isPositive={card >= 0}
            isFlipping={isFlipping}
            selected={selectedCard === index}
            newPlayersPointsCard={newPlayersPoints.filter((player) => player.selectedObjectId == index)}
            onClick={handleCardSelect}
            startNewRound={index === 8 ? startNewRound : undefined}
          />
        ))}
      </div>
    </div>
  );
};
