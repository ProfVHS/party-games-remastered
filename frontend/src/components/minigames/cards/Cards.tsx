import { useEffect, useState } from 'react';
import { Card } from './Card';
import './Cards.scss';

export const Cards = () => {
  const cardsStatus = 'Choose a card';
  const [cards, setCards] = useState([0, 0, 0, 100, 500, 1, -100, -25, -50]);
  const [countdown, setCountdown] = useState<number>(5);

  const handleCardSelect = (id: number) => {
    console.log(id);
  };

  useEffect(() => {
    console.log(cards);
  }, [cards]);

  return (
    <div className="cards">
      <div className="cards__countdown">{countdown}</div>
      <div className="cards__status">{cardsStatus}</div>
      <div className="cards__content">
        {cards.map((card, index) => (
          <Card key={index} id={index} points={card} isPositive={card < 0 ? false : true} isRevealed={card !== 0 ? true : false} onClick={handleCardSelect} />
        ))}
      </div>
    </div>
  );
};
