import { useEffect, useState } from 'react';
import './Cards.scss';
import { PlayerType } from '../../../types/PlayerType';
import { usePlayersStore } from '../../../stores/playersStore';
import { Icon } from '../../../assets/icon';

interface CardProps {
  id: number;
  points: number; // number
  isPositive: boolean;
  newPlayersPointsCard?: PlayerType[];
  onClick: (id: number) => void;
}

export const Card = ({ id, points, isPositive, newPlayersPointsCard, onClick }: CardProps) => {
  const [cardType, setCardType] = useState<'back' | 'positive' | 'negative'>('back'); // 'back', 'positive', 'negative'
  const [flipping, setFlipping] = useState<boolean>(false);
  const revealeTime: number = 400 * (id + 1); // Time in milliseconds to reveal the card
  const { players, setPlayers } = usePlayersStore();
  const pointsToDisplay: string = points < 0 ? points.toString() : '+' + points.toString();

  useEffect(() => {
    if (points == 0) return;

    setTimeout(() => {
      setFlipping(true);

      setTimeout(() => {
        setCardType(isPositive ? 'positive' : 'negative');

        if (!newPlayersPointsCard) return;

        // Update the score for each affected player
        const pointsToAdd = Math.floor(points < 0 ? points * newPlayersPointsCard.length : points / newPlayersPointsCard.length);
        newPlayersPointsCard.forEach((player) => {
          players.forEach((p) => {
            if (p.id === player.id) {
              p.score = (parseInt(p.score) + pointsToAdd).toString();
            }
          });
        });

        setPlayers([...players]);
        setFlipping(false);
      }, 400);
    }, revealeTime);
  }, [points]);

  return (
    <div className={`card ${cardType} ${flipping ? 'flipping' : ''}`} onClick={cardType === 'back' ? () => onClick(id) : undefined}>
      {cardType !== 'back' && <div className="card__content__top">{pointsToDisplay}</div>}
      <div className="card__content">
        {cardType === 'back' && <Icon icon="Logo" className="svg" />}
        {cardType === 'positive' && pointsToDisplay}
        {cardType === 'negative' && <Icon icon="Mine" className="svg" />}
      </div>
      {cardType !== 'back' && <div className="card__content__bottom">{pointsToDisplay}</div>}
    </div>
  );
};
