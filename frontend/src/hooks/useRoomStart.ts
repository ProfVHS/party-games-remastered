import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { useToast } from './useToast';
import { EPossibleMinigames, MinigameDataType } from '../types';
import { usePlayersStore } from '../stores/playersStore';

type useRoomStartProps = {
  playersReady: number;
};

export const useRoomStart = ({ playersReady }: useRoomStartProps) => {
  const toast = useToast();
  const [countdown, setCountdown] = useState<number | null>(null);
  const { players } = usePlayersStore();

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    // TODO: "=== 8" should be dynamic, reacting to the number of current players in the lobby
    // and not hardcoded to 8 as well as with minimum of players.length set to 2
    if (playersReady === players.length && players.length >= 2) {
      setCountdown(3);

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            // TODO: Minigame is hardcoded here, should be dynamic
            socket.emit('start_minigame', EPossibleMinigames.clickTheBomb);
            clearInterval(timer);
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    } else {
      setCountdown(null);
    }

    return () => clearInterval(timer);
  }, [playersReady]);

  useEffect(() => {
    socket.on('started_minigame', (minigameData: MinigameDataType) => {
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

  return { countdown };
};
