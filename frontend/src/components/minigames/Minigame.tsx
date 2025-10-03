import { MinigameNamesEnum } from '@shared/types';
import { Cards } from '@components/minigames/cards/Cards';
import { ClickTheBomb } from '@components/minigames/clickthebomb/ClickTheBomb';
import { useEffect, useState } from 'react';
import { socket } from '@socket';
import { Leaderboard } from '@components/features/leaderboard/Leaderboard';

type MinigameProps = {
  minigameId: string;
  minigameName: string;
};

export const Minigame = ({ minigameId, minigameName }: MinigameProps) => {
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);

  useEffect(() => {
    socket.on('ended_minigame', () => {
      setTimeout(() => {
        setShowLeaderboard(true);
      }, 1500);

      //TODO: At the end send to redis that you are ready for the next game
      setTimeout(() => {
        socket.emit('start_minigame_queue');
      }, 3000);
    });

    return () => {
      socket.off('ended_minigame');
    };
  }, []);

  useEffect(() => {
    console.log(minigameName);
    if (!minigameName) return;
    setShowLeaderboard(false);
  }, [minigameId]);

  return (
    <div>
      {showLeaderboard ? (
        <Leaderboard />
      ) : (
        <>
          {minigameName == MinigameNamesEnum.clickTheBomb && <ClickTheBomb />}
          {minigameName == MinigameNamesEnum.cards && <Cards />}
          {minigameName == MinigameNamesEnum.colorsMemory && <div>Colors Memory</div>}
        </>
      )}
    </div>
  );
};
