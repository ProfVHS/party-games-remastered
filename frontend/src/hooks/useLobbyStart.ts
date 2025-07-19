import { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';
import { useToast } from './useToast';
import { PossibleMinigamesEnum, MinigameDataType } from '../types';
import { usePlayersStore } from '../stores/playersStore';
import { useMinigameStore } from '../stores/gameStore';

type useLobbyStartProps = {
  playersReady: number;
  minigames: PossibleMinigamesEnum[];
  numberOfMinigames?: number | 2;
};

export const useLobbyStart = ({ playersReady, minigames, numberOfMinigames }: useLobbyStartProps) => {
  const toast = useToast();
  const [countdown, setCountdown] = useState<number | null>(null);
  const { players } = usePlayersStore();
  const { setMinigameData } = useMinigameStore();
  const minPlayersToStart = 1;
  const hasStarted = useRef<boolean>(false);

  const getRandomMinigames = (numberOfMinigames: number = 2): PossibleMinigamesEnum[] => {
    const allMinigames = Object.values(PossibleMinigamesEnum).filter((val) => val !== PossibleMinigamesEnum.none);

    // if (numberOfMinigames < 2 || numberOfMinigames > allMinigames.length) {
    //   throw new Error(`Number of minigames must be between 2 and ${allMinigames.length}, but received ${numberOfMinigames}`);
    // }

    const shuffled = [...allMinigames].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, numberOfMinigames);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (playersReady === players.length && players.length >= minPlayersToStart) {
      setCountdown(() => 3);

      if (!minigames || minigames.length === 0) {
        minigames = getRandomMinigames(numberOfMinigames);
      }

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1 && !hasStarted.current) {
            // TODO: Only host can start the minigame
            socket.emit('set_game_plan', minigames);
            socket.emit('start_minigame', minigames[0]);
            hasStarted.current = true;
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
      setMinigameData(minigameData);
    });

    socket.on('failed_to_start_minigame', () => {
      toast.error({ message: 'Failed to start the game', duration: 5 });
    });

    return () => {
      socket.off('started_minigame');
      socket.off('failed_to_start_minigame');
    };
  }, [socket]);

  return { countdown };
};
