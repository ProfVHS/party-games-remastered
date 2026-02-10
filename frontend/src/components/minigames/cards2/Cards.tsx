import "./Cards.scss"
import { useCardsSocket } from '../../../sockets/cardsSocket.ts';
import { Stopwatch } from '@components/ui/stopwatch/Stopwatch.tsx';
import { Card } from '@components/minigames/cards2/Card.tsx';
import { ClassNames } from '@utils';

export const Cards = () => {
  const { gameStatus, cards, round, showIntro, flipCards, selectedCard, handleSelectCard } = useCardsSocket();
  //const roundEndAt = useTurnStore((state) => state.endAt);

  return (
    <div className="cards">
      <div className={`cards__round ${showIntro ? 'visible' : ''}`}>Round {round}</div>
      <div className="cards__countdown">
        <Stopwatch timeLeft={10000} duration={10000} />
      </div>
      <div className="cards__status">{gameStatus}</div>
      <div className={ClassNames('cards__content', {lock: gameStatus === 'Cards Reveal'})}>
        {cards.map((card, index) => (
          <Card key={index} id={index} points={card} isFlipping={flipCards} selected={selectedCard === index} onClick={handleSelectCard} />
        ))}
      </div>
    </div>
  );
};
