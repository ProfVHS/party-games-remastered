import './Cards.scss';
import { useCardsSocket } from '@sockets/cardsSocket.ts';
import { Card } from '@components/minigames/cards/Card.tsx';
import { ClassNames } from '@utils';
import { Stopwatch } from '@components/ui/stopwatch/Stopwatch.tsx';
import { useGameStore } from '@stores/gameStore.ts';

export const Cards = () => {
  const { gameStatus, cards, flipCards, selectedCard, handleSelectCard } = useCardsSocket();
  const durationRoundOrTurn = useGameStore((state) => state.durationRoundOrTurn);

  return (
    <div className="cards">
      <div className="cards__countdown">
        <Stopwatch durationMs={durationRoundOrTurn} />
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
