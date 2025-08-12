import { useEffect, useState, useRef } from 'react';
import { Card } from './Card';
import './Cards.scss';
import { socket } from '../../../socket';
import { usePlayersStore } from '../../../stores/playersStore';
import { PlayerType } from '../../../types/PlayerType';

export const Cards = () => {
  const cardsStatus = 'Choose a card';
  const [cards, setCards] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [countdown, setCountdown] = useState<number>(5);
  const { currentPlayer } = usePlayersStore();
  const hasStarted = useRef<boolean>(false);
  const [newPlayersPoints, setNewPlayerPoints] = useState<PlayerType[]>([]);

  const handleCardSelect = (id: number) => {
    socket.emit('card_select', id);
  };

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (currentPlayer?.isHost === 'true' && !hasStarted.current) socket.emit('cards_round_end');
          hasStarted.current = true;
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  useEffect(() => {
    socket.on('cards_round_ended', (newCards: number[], newPlayersPoints: PlayerType[]) => {
      setCards(() => newCards);
      setNewPlayerPoints(() => newPlayersPoints);
    });

    return () => {
      socket.off('cards_round_ended');
    };
  }, [socket]);

  return (
    <div className="cards">
      <div className="cards__countdown">{countdown}</div>
      <div className="cards__status">{cardsStatus}</div>
      <div className="cards__content">
        {cards.map((card, index) => (
          <Card
            key={index}
            id={index}
            points={card}
            isPositive={card < 0 ? false : true}
            newPlayersPointsCard={newPlayersPoints.filter((player) => player.selectedObjectId == index.toString())}
            onClick={handleCardSelect}
          />
        ))}
      </div>
    </div>
  );
};
