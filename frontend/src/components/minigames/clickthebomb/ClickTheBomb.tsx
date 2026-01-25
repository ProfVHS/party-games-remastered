import './ClickTheBomb.scss';
import { useEffect, useState } from 'react';
import { Button } from '@components/ui/button/Button.tsx';
import Bomb from '@assets/textures/C4.svg?react';
import { socket } from '@socket';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useTurn } from '@hooks/useTurn';
import { RandomScoreBox } from './RandomScoreBox';
import { RandomScoreBoxType } from '@frontend-types/RandomScoreBoxType';
import { TurnNotification } from '@components/features/turnNotification/TurnNotification.tsx';
import { PrizePoolEffect } from '@components/minigames/clickthebomb/PrizePoolEffect.tsx';
import { useToast } from '@hooks/useToast.ts';
import Explosion from '@components/minigames/clickthebomb/Explosion.tsx';
import { ErrorType } from '@shared/types/ErrorType.ts';
import { Timer } from '@components/features/timer/Timer.tsx';

export const ClickTheBomb = () => {
  const [clicksCount, setClicksCount] = useState<number>(0);
  const [canSkipTurn, setCanSkipTurn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [scoreData, setScoreData] = useState<RandomScoreBoxType>({ id: 0, score: 0 });
  const [prizePool, setPrizePool] = useState<number>(0);
  const [exploded, setExploded] = useState<boolean>(false);
  const toast = useToast();

  const changedTurn = () => {
    setCanSkipTurn(false);
    setExploded(false);
    setPrizePool(0);
  };

  const { currentTurn, isMyTurn } = useTurn({ onChangedTurn: changedTurn });
  const currentPlayer = usePlayersStore((state) => state.currentPlayer);

  const handleClickBomb = () => {
    if (loading || !isMyTurn || !currentPlayer?.isAlive) return; // loading - waiting for response from server, or it's not your turn

    setLoading(true);
    socket.emit('bomb_click', false);
  };

  const handleChangeTurn = () => {
    setCanSkipTurn(false);
    socket.emit('change_turn');
  };

  useEffect(() => {
    const bombExploded = () => {
      setLoading(false);
      setExploded(true);
      setClicksCount(0);
      setPrizePool(0);
    };

    socket.on('updated_click_count', (updatedClickCount: number, updatedPrizePool: number) => {
      setLoading(false);
      setClicksCount(updatedClickCount);
      setPrizePool(updatedPrizePool);
      if (isMyTurn) setCanSkipTurn(true);
    });

    socket.on('player_exploded', () => {
      bombExploded();
    });

    socket.on('end_game_click_the_bomb', bombExploded);

    socket.on('show_score', (scoreDelta: number) => {
      setScoreData((prev) => ({ id: (prev?.id ?? 0) + 1, score: scoreDelta }));
    });

    socket.on('click_the_bomb_error', (error: ErrorType) => {
      toast.error({ status: error.status, message: error.message, duration: 5 });
    });

    return () => {
      socket.off('updated_click_count');
      socket.off('player_exploded');
      socket.off('end_game_click_the_bomb');
      socket.off('show_score');
      socket.off('click_the_bomb_error');
    };
  }, [isMyTurn]);

  return (
    <>
      <TurnNotification />
      <div className="click-the-bomb">
        <RandomScoreBox id={scoreData.id} score={scoreData.score} />
        <div className="click-the-bomb__info">
          <span className="click-the-bomb__title">Click The Bomb</span>
          <span className="click-the-bomb__turn">{currentTurn?.nickname} Turn</span>
        </div>
        <div className={`click-the-bomb__bomb ${!isMyTurn || !currentPlayer?.isAlive ? 'bomb__lock' : 'bomb__active'}`} onClick={handleClickBomb}>
          <Bomb />
          <span className="click-the-bomb__counter">{clicksCount! >= 10 ? clicksCount : '0' + clicksCount}</span>
          <Timer className="click-the-bomb__timer" />
        </div>
        <Button className="click-the-bomb__button" type="button" size="medium" isDisabled={!canSkipTurn} onClick={handleChangeTurn}>
          Next
        </Button>
        <div className={`click-the-bomb__prize`}>
          <div className="click-the-bomb__prize__text">Prize Pool:</div>
          <PrizePoolEffect points={prizePool} playerExploded={exploded} setExploded={setExploded} />
        </div>
        {exploded && (
          <div className={'click-the-bomb__explode'}>
            <Explosion />
          </div>
        )}
      </div>
    </>
  );
};
