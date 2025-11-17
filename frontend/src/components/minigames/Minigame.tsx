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
  const [leaderboardPlayers, setLeaderboardPlayers] = useState<PlayerType[]>([]);
  const { setPlayers, setOldPlayers, oldPlayers } = usePlayersStore();

  useEffect(() => {
    socket.on('ended_minigame', (newPlayers: PlayerType[]) => {
      // Show Leaderboard
      setTimeout(() => {
        setLeaderboardPlayers(oldPlayers);
        setShowLeaderboard(true);
      }, 2000);

      // Change for new players
      setTimeout(() => {
        setLeaderboardPlayers(newPlayers);
      }, 5000);

      // Start next game
      setTimeout(() => {
        setOldPlayers(newPlayers);
        setPlayers(newPlayers);
        socket.emit('start_minigame_queue');
      }, 8000);
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
        <Leaderboard leaderboardPlayers={leaderboardPlayers} />
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
