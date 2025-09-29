import './ClickTheBomb.scss';
import { useEffect, useState } from 'react';
import { Button } from '@components/ui/button/Button.tsx';
import Bomb from '@assets/textures/C4.svg?react';
import { socket } from '@socket';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useCountdownAnimation } from '@hooks/useCountdownAnimation';

const formatMilisecondsToTimer = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10); // two-digit ms
  return `${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
};

//TODO: points aniamtion +30 apeearing and disapperaing next to bomb
//TODO: Explosion animation
//TODO: use coutdown hook
//TODO: explode player after time
//TODO: End game

export const ClickTheBomb = () => {
  const [clicksCount, setClicksCount] = useState<number>(0);
  const [turnNickname, setTurnNickname] = useState<string>('');
  const [canSkipTurn, setCanSkipTurn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bombLock, setBombLock] = useState<boolean>(true);
  const { currentPlayer, players } = usePlayersStore();

  const handlePlayerDeath = () => {
    if (currentPlayer?.nickname != turnNickname) return;

    console.log('Countdown animation has ended');
    // socket.emit("")
  };

  const { animationTimeLeft, startCountdownAnimation, stopCountdownAnimation } = useCountdownAnimation(5, handlePlayerDeath);

  const handleClickBomb = () => {
    if (loading || bombLock) return;

    socket.emit('update_click_count');
    stopCountdownAnimation();
    setLoading(true);
    setCanSkipTurn(true);
  };

  const handleChangeTurn = () => {
    socket.emit('change_turn');
    stopCountdownAnimation();
    setCanSkipTurn(false);
    setBombLock(true);
  };

  useEffect(() => {
    socket.on('updated_click_count', (updatedClickCount: number) => {
      setLoading(false);
      setClicksCount(updatedClickCount);
      startCountdownAnimation();
    });

    socket.on('changed_turn', (data: string) => {
      setTurnNickname(() => data);
      setCanSkipTurn(false);
      startCountdownAnimation();
      if (data === currentPlayer?.nickname) {
        setBombLock(false);
      } else {
        setBombLock(true);
      }
    });

    socket.on('got_turn', (data) => {
      const currentTurnPlayerNickname = players[parseInt(data)].nickname;

      setTurnNickname(() => currentTurnPlayerNickname);
      if (currentPlayer?.nickname === currentTurnPlayerNickname) {
        setBombLock(false);
      }
    });

    return () => {
      socket.off('updated_click_count');
      socket.off('changed_turn');
      socket.off('got_turn');
    };
  }, [socket]);

  useEffect(() => {
    startCountdownAnimation();
    if (currentPlayer?.isHost === 'true') socket.emit('get_turn');
    return () => stopCountdownAnimation();
  }, []);

  return (
    <div className="click-the-bomb">
      <div className="click-the-bomb__info">
        <span className="click-the-bomb__title">Click The Bomb</span>
        <span className="click-the-bomb__turn">{turnNickname} Turn</span>
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
