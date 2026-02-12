import { socket } from '@socket';
import { useEffect, useState } from 'react';
import { MinigameNamesEnum, PlayerType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';

type MinigameSocketProps = {
  minigameName: MinigameNamesEnum;
  tutorialsEnabled: boolean;
};

export const useMinigameSocket = ({ minigameName, tutorialsEnabled }: MinigameSocketProps) => {
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [startGame, setStartGame] = useState<boolean>(false);
  const [scoreboardPlayers, setScoreboardPlayersPlayers] = useState<PlayerType[]>([]);
  const setPlayers = usePlayersStore((state) => state.setPlayers);
  const setOldPlayers = usePlayersStore((state) => state.setOldPlayers);
  const currentPlayer = usePlayersStore((state) => state.currentPlayer);

  const handleStartNewGame = () => {
    if (tutorialsEnabled) {
      setShowTutorial(true);
    } else {
      setStartGame(true);
    }
  };

  useEffect(() => {
    socket.on('ended_minigame', handleEndGame);
    socket.on('tutorial_completed', handleTutorialCompleted);

    return () => {
      socket.off('ended_minigame');
      socket.off('tutorial_completed');
    };
  }, []);

  const handleEndGame = (newPlayers: PlayerType[]) => {
    // Show Leaderboard
    setTimeout(() => {
      setShowLeaderboard(true);
      setScoreboardPlayersPlayers(newPlayers);
      setStartGame(false);
      setPlayers(newPlayers);
    }, 2000);

    // Start next game
    setTimeout(() => {
      setOldPlayers(newPlayers);
      if (currentPlayer?.isHost) {
        socket.emit('set_minigame');
      }
    }, 8000);
  };

  const handleTutorialCompleted = () => {
    setShowTutorial(false);
    setShowLeaderboard(false);
    setStartGame(true);
  };

  useEffect(() => {
    if (!minigameName) return;

    setShowLeaderboard(false);
    handleStartNewGame();
  }, []);

  return { startGame, showLeaderboard, showTutorial, scoreboardPlayers };
};
