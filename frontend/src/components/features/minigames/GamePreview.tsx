import { GameRoomDataType } from '../../../types';

type GamePreviewProps = {
  minigame: GameRoomDataType;
};

export const GamePreview = ({ minigame }: GamePreviewProps) => {
  return (
    <div className="game-preview">
      <h1 className="game-preview__title">{minigame.minigame}</h1>
      <img className="game-preview__image" src="https://placehold.co/400x400" />
    </div>
  );
};
