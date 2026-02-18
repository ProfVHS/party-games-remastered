import './TrickyDiamonds.scss';
import { TRICKY_DIAMONDS_RULES } from '@shared/constants/gameRules.ts';
import { ProgressBar } from '@components/ui/progressBar/ProgressBar.tsx';
import { Diamond } from '@components/minigames/trickydiamonds/Diamond.tsx';
import { useTrickyDiamondsSocket } from '@sockets/trickyDiamondsSocket.ts';
import { useGameStore } from '@stores/gameStore.ts';

const roundsDiamonds = [TRICKY_DIAMONDS_RULES.ROUND_1, TRICKY_DIAMONDS_RULES.ROUND_2, TRICKY_DIAMONDS_RULES.ROUND_3];

export const TrickyDiamonds = () => {
  const { diamonds, reveal, gameStatus, selectedDiamond, handleSelectDiamond } = useTrickyDiamondsSocket();
  const round = useGameStore((state) => state.currentRound);

  return (
    <div className="tricky-diamonds">
      <div className="tricky-diamonds__title">{gameStatus}</div>
      <div className="tricky-diamonds__timer">
        <ProgressBar durationMs={TRICKY_DIAMONDS_RULES.COUNTDOWN_MS} />
      </div>
      <div className="tricky-diamonds__container tricky-diamonds__selected">
        {diamonds &&
          diamonds.map((diamond, index) => (
            <Diamond
              key={index}
              diamond={diamond}
              reveal={reveal}
              score={roundsDiamonds[round ? round - 1 : 0][diamond.id]}
              won={diamond.won}
              isSelected={diamond.id === selectedDiamond}
              onSelect={handleSelectDiamond}
            />
          ))}
      </div>
    </div>
  );
};
