import './TrickyDiamonds.scss';
import HighDiamond from '@assets/textures/highDiamond.svg?react';
import MediumDiamond from '@assets/textures/mediumDiamond.svg?react';
import LowDiamond from '@assets/textures/lowDiamond.svg?react';
import { socket } from '@socket';
import { useCountdown } from '@hooks/useCountdown.ts';
import { useEffect, useState } from 'react';
import { TRICKY_DIAMONDS_RULES } from '@shared/constants/gameRules.ts';

type Stats = {
  id: number;
  count: number;
  players: string[];
};

export const TrickyDiamonds = () => {
  const [diamondsStats, setDiamondsStats] = useState<Stats[]>();
  const [diamondIdWinner, setDiamondIdWinner] = useState<number | null>(null);
  const [round, setRound] = useState<number>(0);
  const [reveal, setReveal] = useState<boolean>(false);
  const roundsDiamonds = [TRICKY_DIAMONDS_RULES.ROUND_1, TRICKY_DIAMONDS_RULES.ROUND_2, TRICKY_DIAMONDS_RULES.ROUND_3];
  const countdownDuration = TRICKY_DIAMONDS_RULES.COUNTDOWN;

  const endRound = () => {
    socket.emit('start_round_queue');
  };

  const { timeLeft, startCountdown, stopCountdown } = useCountdown(countdownDuration, 1, endRound);

  const handleDiamondSelect = (id: number) => {
    socket.emit('diamond_select', id);
  };

  useEffect(() => {
    socket.on('tricky_diamonds_round_ended', (diamondStats, diamondIdWinner, nextRound) => {
      setReveal(true);
      setDiamondsStats(diamondStats);
      setTimeout(() => {
        setDiamondIdWinner(diamondIdWinner);
      }, 1000);

      setTimeout(() => {
        if (nextRound === 3) {
          return;
        }

        setRound(nextRound);
        setReveal(false);
        setDiamondIdWinner(null);
        startCountdown();
      }, 3000);
    });
  }, [diamondIdWinner]);

  useEffect(() => {
    startCountdown();

    return () => {
      stopCountdown();
    };
  }, []);

  return (
    <div className="tricky-diamonds">
      <div className="tricky-diamonds__timer">{timeLeft}</div>
      <div className="tricky-diamonds__title">Choose Wisely</div>
      <div className="tricky-diamonds__container">
        <div className="tricky-diamonds__diamond" onClick={() => handleDiamondSelect(0)}>
          {reveal && diamondsStats && (
            <div className={`tricky-diamonds__players__list`}>
              {diamondsStats
                .filter((stat) => stat.id === 0)
                .flatMap((stat) => stat.players)
                .map((nickname, i) => (
                  <div key={i}>{nickname}</div>
                ))}
            </div>
          )}
          <HighDiamond />
          <span className="tricky-diamonds__diamond__value">+{roundsDiamonds[round][0]}</span>
        </div>
        <div className="tricky-diamonds__diamond" onClick={() => handleDiamondSelect(1)}>
          {reveal && diamondsStats && (
            <div className={`tricky-diamonds__players__list`}>
              {diamondsStats
                .filter((stat) => stat.id === 1)
                .flatMap((stat) => stat.players)
                .map((nickname, i) => (
                  <div key={i}>{nickname}</div>
                ))}
            </div>
          )}
          <MediumDiamond />
          <span className="tricky-diamonds__diamond__value">+{roundsDiamonds[round][1]}</span>
        </div>
        <div className="tricky-diamonds__diamond" onClick={() => handleDiamondSelect(2)}>
          {reveal && diamondsStats && (
            <div className={`tricky-diamonds__players__list`}>
              {diamondsStats
                .filter((stat) => stat.id === 2)
                .flatMap((stat) => stat.players)
                .map((nickname, i) => (
                  <div key={i}>{nickname}</div>
                ))}
            </div>
          )}
          <LowDiamond />
          <span className="tricky-diamonds__diamond__value">+{roundsDiamonds[round][2]}</span>
        </div>
      </div>
    </div>
  );
};
