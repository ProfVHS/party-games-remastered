import './Cards.scss';
import { useCardsSocket } from '@sockets/cardsSocket.ts';
import { Card } from '@components/minigames/cards/Card.tsx';
import { ClassNames } from '@utils';
import { Stopwatch } from '@components/ui/stopwatch/Stopwatch.tsx';
import { useGameStore } from '@stores/gameStore.ts';
import { CARDS_GAME_STATUS } from '@shared/types';

export const Cards = () => {
  const { gameStatus, cards, selectedCard, cardPlayersMap, handleSelectCard } = useCardsSocket();
  const durationRoundOrTurn = useGameStore((state) => state.durationRoundOrTurn);

  return (
    <div className="cards">
      <div className="cards__countdown">
        <Stopwatch durationMs={durationRoundOrTurn} />
      </div>
      <div className="cards__status">{gameStatus}</div>
      <div className={ClassNames('cards__content', { lock: gameStatus === CARDS_GAME_STATUS.REVEAL })}>
        {cards.map((card, index) => (
          <Card
            key={index}
            id={index}
            points={card}
            gameStatus={gameStatus}
            selected={selectedCard === index}
            playersMap={cardPlayersMap[index]}
            onClick={handleSelectCard}
          />
        ))}
      </div>
    </div>
  );
};
