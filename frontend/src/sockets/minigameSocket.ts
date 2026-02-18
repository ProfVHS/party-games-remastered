import { socket } from '@socket';
import { useEffect, useState } from 'react';
import { MinigameNamesEnum } from '@shared/types';

export const useMinigameSocket = (minigameName: MinigameNamesEnum, tutorialsEnabled: boolean) => {
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [startGame, setStartGame] = useState<boolean>(false);

  const handleStartNewGame = () => {
    if (tutorialsEnabled) {
      setShowTutorial(true);
    } else {
      setStartGame(true);
    }
  };

  useEffect(() => {
    socket.on('tutorial_completed', handleTutorialCompleted);

    return () => {
      socket.off('tutorial_completed');
    };
  }, []);

  const handleTutorialCompleted = () => {
    setShowTutorial(false);
    setStartGame(true);
  };

  useEffect(() => {
    if (!minigameName) return;

    handleStartNewGame();
  }, []);

  return { startGame, showTutorial };
};
