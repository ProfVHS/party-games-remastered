import { MinigameNamesEnum, PlayerType } from '@shared/types';
import { Cards } from '@components/minigames/cards/Cards';
import { ClickTheBomb } from '@components/minigames/clickthebomb/ClickTheBomb';
import { useEffect, useState } from 'react';
import { socket } from '@socket';
import { Leaderboard } from '@components/features/leaderboard/Leaderboard';
import { usePlayersStore } from '@stores/playersStore.ts';

type MinigameProps = {
  minigameId: string;
  minigameName: string;
};

export const Minigame = ({ minigameId, minigameName }: MinigameProps) => {
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const { setPlayers } = usePlayersStore();

  useEffect(() => {
    socket.on('ended_minigame', (newPlayers: PlayerType[]) => {
      setTimeout(() => {
        setPlayers(newPlayers);
        setShowLeaderboard(true);
      }, 1500);

      setTimeout(() => {
        socket.emit('start_minigame_queue');
      }, 3000);
    });

    return () => {
      socket.off('ended_minigame');
    };
  }, []);

  useEffect(() => {
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
