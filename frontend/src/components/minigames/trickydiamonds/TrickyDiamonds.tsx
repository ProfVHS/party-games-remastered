import './TrickyDiamonds.scss';
import { socket } from '@socket';
import { useEffect, useState } from 'react';
import { TRICKY_DIAMONDS_RULES } from '@shared/constants/gameRules.ts';
import { useCountdownAnimation } from '@hooks/useCountdownAnimation.ts';
import { ProgressBar } from '@components/ui/progressBar/ProgressBar.tsx';
import { Diamond } from '@components/minigames/trickydiamonds/Diamond.tsx';

type DiamondPlayers = {
  id: number;
  players: string[];
};

const roundsDiamonds = [TRICKY_DIAMONDS_RULES.ROUND_1, TRICKY_DIAMONDS_RULES.ROUND_2, TRICKY_DIAMONDS_RULES.ROUND_3];

export const TrickyDiamonds = () => {
  const [diamondsStats, setDiamondsStats] = useState<DiamondPlayers[]>([
    { id: 0, players: [] },
    { id: 1, players: [] },
    { id: 2, players: [] },
  ]);
  const [diamondIdWinner, setDiamondIdWinner] = useState<number | null>(null);
  const [round, setRound] = useState<number>(0);
  const [reveal, setReveal] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const countdownDuration = TRICKY_DIAMONDS_RULES.COUNTDOWN;

  const endRound = () => {
    socket.emit('end_round_queue');
  };

  const { animationTimeLeft, startCountdownAnimation, stopCountdownAnimation } = useCountdownAnimation(countdownDuration, endRound);

  // TODO: Make it as a hook
  const handleDiamondSelect = (id: number) => {
    socket.emit('diamond_select', id);
    setSelectedId(id);
  };

  useEffect(() => {
    socket.on('tricky_diamonds_round_ended', (diamondStats, diamondIdWinner, nextRound) => {
      setReveal(true);
      setDiamondsStats(diamondStats);
      setDiamondIdWinner(diamondIdWinner);

      setTimeout(() => {
        setSelectedId(null);
        setRound(nextRound - 1);
        setReveal(false);
        setDiamondIdWinner(null);
        startCountdownAnimation();
      }, 3000);
    });
  }, [diamondIdWinner]);

  useEffect(() => {
    startCountdownAnimation();

    return () => {
      stopCountdownAnimation();
    };
  }, []);

  return (
    <div className="tricky-diamonds">
      <div className="tricky-diamonds__title">{reveal ? 'Judgment Time' : 'Choose Wisely'}</div>
      <div className="tricky-diamonds__timer">
        <ProgressBar timeLeft={animationTimeLeft} duration={countdownDuration} />
      </div>
      <div className="tricky-diamonds__container tricky-diamonds__selected">
        {diamondsStats &&
          diamondsStats.map((diamond, index) => (
            <Diamond
              key={index}
              diamond={diamond}
              reveal={reveal}
              score={roundsDiamonds[round][diamond.id]}
              won={diamond.id === diamondIdWinner}
              isSelected={diamond.id === selectedId}
              onSelect={handleDiamondSelect}
            />
          ))}
      </div>
    </div>
  );
};
