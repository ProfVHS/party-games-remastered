import './TrickyDiamonds.scss';
import { TRICKY_DIAMONDS_RULES } from '@shared/constants/gameRules.ts';
import { ProgressBar } from '@components/ui/progressBar/ProgressBar.tsx';
import { Diamond } from '@components/minigames/trickydiamonds/Diamond.tsx';
import { useTrickyDiamondsSocket } from '@sockets/trickyDiamondsSocket.ts';

const roundsDiamonds = [TRICKY_DIAMONDS_RULES.ROUND_1, TRICKY_DIAMONDS_RULES.ROUND_2, TRICKY_DIAMONDS_RULES.ROUND_3];

export const TrickyDiamonds = () => {
  const { diamonds, round, reveal, roundEndAt, selectedDiamond, handleSelectDiamond } = useTrickyDiamondsSocket();

  return (
    <div className="tricky-diamonds">
      <div className="tricky-diamonds__title">{reveal ? 'Judgment Time' : 'Choose Wisely'}</div>
      <div className="tricky-diamonds__timer">
        <ProgressBar endAt={roundEndAt} duration={TRICKY_DIAMONDS_RULES.COUNTDOWN_MS} />
      </div>
      <div className="tricky-diamonds__container tricky-diamonds__selected">
        {diamonds &&
          diamonds.map((diamond, index) => (
            <Diamond
              key={index}
              diamond={diamond}
              reveal={reveal}
              score={roundsDiamonds[round - 1][diamond.id]}
              won={diamond.won}
              isSelected={diamond.id === selectedDiamond}
              onSelect={handleSelectDiamond}
            />
          ))}
      </div>
    </div>
  );
};
