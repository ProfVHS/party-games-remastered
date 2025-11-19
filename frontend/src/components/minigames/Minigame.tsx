import { MinigameNamesEnum, PlayerType } from '@shared/types';
import { Cards } from '@components/minigames/cards/Cards';
import { ClickTheBomb } from '@components/minigames/clickthebomb/ClickTheBomb';
import { useEffect, useState } from 'react';
import { socket } from '@socket';
import { Leaderboard } from '@components/features/leaderboard/Leaderboard';
import { usePlayersStore } from '@stores/playersStore.ts';
import { Tutorial } from '@components/features/tutorials/Tutorial.tsx';
import { useRoomStore } from '@stores/roomStore.ts';

type MinigameProps = {
  minigameId: string;
  minigameName: MinigameNamesEnum;
};

export const Minigame = ({ minigameId, minigameName }: MinigameProps) => {
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [leaderboardPlayers, setLeaderboardPlayers] = useState<PlayerType[]>([]);
  const { setPlayers, setOldPlayers, oldPlayers } = usePlayersStore();
  const { roomSettings } = useRoomStore();

  const handleStartNewGame = () => {
    if (roomSettings.isTutorialsEnabled) {
      setShowTutorial(true);
    } else {
      socket.emit('start_minigame_queue');
    }
  };

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
        handleStartNewGame();
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

  useEffect(() => {
    if (roomSettings.isTutorialsEnabled) {
      handleStartNewGame();
    }
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
      {showTutorial && <Tutorial minigameName={minigameName} />}
    </div>
  );
};
