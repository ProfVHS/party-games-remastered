import Trophy from '@assets/textures/trophy.svg?react';

type WinCardProps = {
  score: number;
};

export const WinCard = ({ score }: WinCardProps) => {
  return (
    <div className="win__background">
      <span className="score">+{score}</span>
      <Trophy />
    </div>
  );
};
