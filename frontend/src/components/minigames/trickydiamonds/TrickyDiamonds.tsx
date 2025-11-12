import './TrickyDiamonds.scss';
import HighDiamond from '@assets/textures/highDiamond.svg?react';
import MediumDiamond from '@assets/textures/mediumDiamond.svg?react';
import LowDiamond from '@assets/textures/lowDiamond.svg?react';
import { socket } from '@socket';
import { useEffect, useState } from 'react';
import { TRICKY_DIAMONDS_RULES } from '@shared/constants/gameRules.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import { ProgressBar } from '@components/ui/progressBar/ProgressBar.tsx';
import { useCountdownAnimation } from '@hooks/useCountdownAnimation.ts';
import Trophy from '@assets/textures/trophy.svg?react';

type Stats = {
  id: number;
  count: number;
  players: string[];
};

export const TrickyDiamonds = () => {
  const [diamondsStats, setDiamondsStats] = useState<Stats[]>([
    { id: 0, count: 0, players: [] },
    { id: 1, count: 0, players: [] },
    { id: 2, count: 0, players: [] },
  ]);
  const [diamondIdWinner, setDiamondIdWinner] = useState<number | null>(null);
  const [round, setRound] = useState<number>(0);
  const [reveal, setReveal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const roundsDiamonds = [TRICKY_DIAMONDS_RULES.ROUND_1, TRICKY_DIAMONDS_RULES.ROUND_2, TRICKY_DIAMONDS_RULES.ROUND_3];
  const countdownDuration = TRICKY_DIAMONDS_RULES.COUNTDOWN;
  const { currentPlayer } = usePlayersStore();

  const endRound = () => {
    socket.emit('end_round_queue');
  };

  const { animationTimeLeft, startCountdownAnimation, stopCountdownAnimation } = useCountdownAnimation(countdownDuration, endRound);

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
        if (nextRound === 4) {
          if (currentPlayer?.isHost) socket.emit('end_minigame');
          return;
        }

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
            <div key={index} className="tricky-diamonds__diamond" onClick={() => handleDiamondSelect(diamond.id)}>
              {reveal && (
                <div className={`tricky-diamonds__players__list ${diamond.id === diamondIdWinner ? 'win' : 'lost'}`}>
                  {diamond.id === diamondIdWinner ? (
                    <div className="win__background">
                      <span className="score">+{roundsDiamonds[round][diamond.id]}</span>
                      <Trophy />
                    </div>
                  ) : (
                    <div className="lost__background">
                      <div className="cross part__one"></div>
                      <div className="cross part__two"></div>
                    </div>
                  )}
                  {diamond.players.map((nickname, i) => (
                    <div key={i} className="player">
                      {nickname}
                    </div>
                  ))}
                </div>
              )}
              <span className={`${!reveal && selectedId === diamond.id ? 'selected' : ''}`}>
                {diamond.id === 0 && <HighDiamond />}
                {diamond.id === 1 && <MediumDiamond />}
                {diamond.id === 2 && <LowDiamond />}
              </span>
              <span className="tricky-diamonds__diamond__value">+{roundsDiamonds[round][diamond.id]}</span>
            </div>
          ))}
      </div>
    </div>
  );
};
