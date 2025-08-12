import { useEffect, useState } from 'react';
import './Cards.scss';
import { PlayerType } from '../../../types/PlayerType';
import { usePlayersStore } from '../../../stores/playersStore';
interface CardProps {
  id: number;
  points: number; // number
  isPositive: boolean;
  newPlayersPointsCard?: PlayerType[];
  onClick: (id: number) => void;
}

export const Card = ({ id, points, isPositive, newPlayersPointsCard, onClick }: CardProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const revealeTime = 400 * (id + 1); // Time in milliseconds to reveal the card

  const { players, setPlayers } = usePlayersStore();

  useEffect(() => {
    if (points == 0) return;

    setTimeout(() => {
      setIsRevealed(true);
      if (!newPlayersPointsCard) return;

      const pointsToAdd = points < 0 ? points * newPlayersPointsCard.length : points / newPlayersPointsCard.length;

      // TODO: Change it if it will be a problem
      // Update the score of players who selected this card
      newPlayersPointsCard.forEach((player) => {
        players.forEach((p) => {
          if (p.id === player.id) {
            p.score = (parseInt(p.score) + pointsToAdd).toString();
          }
        });
      });

      setPlayers([...players]);
    }, revealeTime);
  }, [points]);

  return (
    <div className={`card ${!isRevealed ? 'back' : isPositive ? 'positive' : 'negative'}`} onClick={!isRevealed ? () => onClick(id) : undefined}>
      {isRevealed && points}
    </div>
  );
};
