import './ClickTheBomb.scss';
import { useEffect, useState } from 'react';
import { Button } from '@components/ui/button/Button.tsx';
import Bomb from '@assets/textures/C4.svg?react';
import { socket } from '@socket';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useCountdownAnimation } from '@hooks/useCountdownAnimation';
import { RandomScoreBox } from './RandomScoreBox';
import { TurnType } from '@shared/types';
import { useTurn } from '@hooks/useTurn';
import { CLICK_THE_BOMB_RULES } from '@shared/constants/gameRules';

const formatMilisecondsToTimer = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10); // two-digit ms
  return `${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
};

//TODO: Explosion animation
//TODO: End game

export const ClickTheBomb = () => {
  const [clicksCount, setClicksCount] = useState<number>(0);
  const [canSkipTurn, setCanSkipTurn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bombLock, setBombLock] = useState<boolean>(true);
  const [scoreData, setScoreData] = useState<{ id: number; isPositive: boolean }>();

  const handlePlayerDeath = () => {
    if (currentPlayer?.id != currentTurn?.player_id) return;
    socket.emit('update_click_count', true);
  };

  const changedTurn = (newTurn: TurnType) => {
    setCanSkipTurn(false);
    startCountdownAnimation();
    newTurn.player_id === currentPlayer?.id ? setBombLock(false) : setBombLock(true);
  };

  const gotTurn = (newTurn: TurnType) => {
    currentPlayer?.nickname === newTurn.nickname ? setBombLock(false) : setBombLock(true);
  };

  const { currentPlayer } = usePlayersStore();
  const { animationTimeLeft, startCountdownAnimation, stopCountdownAnimation } = useCountdownAnimation(CLICK_THE_BOMB_RULES.COUNTDOWN, handlePlayerDeath);
  const currentTurn = useTurn({ onChangedTurn: changedTurn, onGotTurn: gotTurn });

  const handleClickBomb = () => {
    if (loading || bombLock) return; // loading - waiting for response from server, bombLock - it's not your turn

    socket.emit('update_click_count', false);
    stopCountdownAnimation();
    setCanSkipTurn(true);
    setLoading(true);
  };

  const handleChangeTurn = () => {
    socket.emit('change_turn');
    stopCountdownAnimation();
    setCanSkipTurn(false);
    setBombLock(true);
  };

  useEffect(() => {
    startCountdownAnimation();

    socket.on('updated_click_count', (updatedClickCount: number) => {
      setLoading(false);
      setClicksCount(updatedClickCount);
      startCountdownAnimation();
    });

    socket.on('show_score', (playerExploded: boolean) => {
      setScoreData((prev) => ({ id: (prev?.id ?? 0) + 1, isPositive: !playerExploded }));
    });

    return () => {
      socket.off('updated_click_count');
      socket.off('show_score');
      stopCountdownAnimation();
    };
  }, []);

  return (
    <div className="click-the-bomb">
      <RandomScoreBox id={scoreData?.id} isPositive={scoreData?.isPositive} />
      <div className="click-the-bomb__info">
        <span className="click-the-bomb__title">Click The Bomb</span>
        <span className="click-the-bomb__turn">{currentTurn?.nickname} Turn</span>
      </div>
      <div className={`click-the-bomb__bomb ${bombLock ? 'bomb__lock' : 'bomb__active'}`} onClick={handleClickBomb}>
        <Bomb />
        <span className="click-the-bomb__counter">{clicksCount! >= 10 ? clicksCount : '0' + clicksCount}</span>
        <span className="click-the-bomb__timer">{formatMilisecondsToTimer(animationTimeLeft)}</span>
      </div>
      <Button className="click-the-bomb__button" type="button" size="medium" isDisabled={!canSkipTurn} onClick={handleChangeTurn}>
        Next
      </Button>
    </div>
  );
};
