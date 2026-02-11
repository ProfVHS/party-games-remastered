import { MinigameNamesEnum, PlayerType } from '@shared/types';
import { Cards } from '@components/minigames/cards/Cards';
import { ClickTheBomb } from '@components/minigames/clickthebomb/ClickTheBomb';
import { TrickyDiamonds } from '@components/minigames/trickydiamonds/TrickyDiamonds.tsx';
import { useEffect, useState } from 'react';
import { Scoreboard } from '@components/features/leaderboard/Scoreboard.tsx';
import { Tutorial } from '@components/features/tutorials/Tutorial.tsx';
import { socket } from '@socket';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useRoomStore } from '@stores/roomStore.ts';

type MinigameProps = {
  minigameId: string;
  minigameName: MinigameNamesEnum;
};

export const Minigame = ({ minigameId, minigameName }: MinigameProps) => {
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [scoreboardPlayers, setScoreboardPlayersPlayers] = useState<PlayerType[]>([]);
  const [startGame, setStartGame] = useState<boolean>(false);
  const { setPlayers, setOldPlayers, currentPlayer } = usePlayersStore();
  const { roomSettings } = useRoomStore();

  const handleStartNewGame = () => {
    if (roomSettings.isTutorialsEnabled) {
      setShowTutorial(true);
    } else {
      setStartGame(true);
    }
  };

  useEffect(() => {
    socket.on('ended_minigame', (newPlayers: PlayerType[]) => {
      // Show Leaderboard
      setTimeout(() => {
        setShowLeaderboard(true);
        setStartGame(false);
        setScoreboardPlayersPlayers(newPlayers);
        setPlayers(newPlayers);
      }, 2000);

      // Start next game
      setTimeout(() => {
        setOldPlayers(newPlayers);
        if (currentPlayer?.isHost) {
          socket.emit('start_minigame_queue');
        }
      }, 8000);
    });

    socket.on('tutorial_completed', () => {
      setShowTutorial(false);
      setShowLeaderboard(false);
      setStartGame(true);
    });

    return () => {
      socket.off('ended_minigame');
      socket.off('tutorial_completed');
    };
  }, [showTutorial, startGame, showLeaderboard]);

  useEffect(() => {
    if (!minigameName) return;

    setShowLeaderboard(false);
    handleStartNewGame();
  }, [minigameId]);

  return (
    <div>
      {showLeaderboard ? (
        <Scoreboard scoreboardPlayers={scoreboardPlayers} />
      ) : (
        <>
          {minigameName == MinigameNamesEnum.clickTheBomb && <ClickTheBomb />}
          {minigameName == MinigameNamesEnum.cards && <Cards />}
          {minigameName == MinigameNamesEnum.colorsMemory && <div>Colors Memory</div>}
          {minigameName == MinigameNamesEnum.trickyDiamonds && <TrickyDiamonds />}
        </>
      )}
      {showTutorial && <Tutorial minigameName={minigameName} />}
    </div>
  );
};
