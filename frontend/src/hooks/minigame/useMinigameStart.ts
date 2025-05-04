import { useEffect } from 'react';
import { socket } from '../../socket';
import { useToast } from '../useToast';
import { GameRoomDataType } from '../../types';

export const useMinigameStart = () => {
  const toast = useToast();
  useEffect(() => {
    socket.on('started_minigame', (minigameData: GameRoomDataType) => {
      // TODO: Display Minigame / Navigate to minigame / Start minigame on client idk
      console.log(minigameData); // TODO: remove this later
    });

    socket.on('failed_to_start_minigame', () => {
      toast.error({ message: 'Failed to start the game', duration: 5 });
    });

    return () => {
      socket.off('started_minigame');
      socket.off('failed_to_start_minigame');
    };
  }, []);
};
