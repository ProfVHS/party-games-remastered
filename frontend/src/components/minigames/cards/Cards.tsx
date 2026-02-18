import './Cards.scss';
import { useCardsSocket } from '@sockets/cardsSocket.ts';
import { Card } from '@components/minigames/cards/Card.tsx';
import { ClassNames } from '@utils';
import { Stopwatch } from '@components/ui/stopwatch/Stopwatch.tsx';
import { CARDS_RULES } from '@shared/constants/gameRules.ts';

export const Cards = () => {
  const { gameStatus, cards, flipCards, selectedCard, handleSelectCard } = useCardsSocket();

  return (
    <div className="cards">
      <div className="cards__countdown">
        <Stopwatch durationMs={CARDS_RULES.COUNTDOWN_MS} />
      </div>
      <div className="cards__status">{gameStatus}</div>
      <div className={ClassNames('cards__content', { lock: gameStatus === 'Cards Reveal' })}>
        {cards.map((card, index) => (
          <Card key={index} id={index} points={card} isFlipping={flipCards} selected={selectedCard === index} onClick={handleSelectCard} />
        ))}
      </div>
    </div>
  );
};
