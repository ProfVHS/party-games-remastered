import './TrickyDiamonds.scss';
import { ProgressBar } from '@components/ui/progressBar/ProgressBar.tsx';
import { Diamond } from '@components/minigames/trickydiamonds/Diamond.tsx';
import { useTrickyDiamondsSocket } from '@sockets/trickyDiamondsSocket.ts';
import { useGameStore } from '@stores/gameStore.ts';

export const TrickyDiamonds = () => {
  const { diamonds, gameStatus, selectedDiamond, handleSelectDiamond } = useTrickyDiamondsSocket();
  const durationRoundOrTurn = useGameStore((state) => state.durationRoundOrTurn);
  const config = useGameStore((state) => state.config);

  return (
    <div className="tricky-diamonds">
      <div className="tricky-diamonds__title">{gameStatus}</div>
      <div className="tricky-diamonds__timer">
        <ProgressBar durationMs={durationRoundOrTurn} />
      </div>
      <div className="tricky-diamonds__container tricky-diamonds__selected">
        {diamonds &&
          diamonds.map((diamond, index) => (
            <Diamond
              key={index}
              diamond={diamond}
              gameStatus={gameStatus}
              score={config![index]}
              won={diamond.won}
              isSelected={diamond.id === selectedDiamond}
              onSelect={handleSelectDiamond}
            />
          ))}
      </div>
    </div>
  );
};
