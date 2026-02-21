import Trophy from '@assets/textures/trophy.svg?react';

type WinCardProps = {
  score: number;
};

export const WinCard = ({ score }: WinCardProps) => {
  return (
    <div className="tricky-diamonds__players__list--won__background">
      <span className="score">+{score}</span>
      <Trophy />
    </div>
  );
};
