import { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { socket } from '../socket';
import { useToast } from './useToast';
import { MinigameNamesEnum } from '../types';
import { usePlayersStore } from '../stores/playersStore';
import { MIN_PLAYERS_TO_START } from '../../../shared/constants/game';

type useLobbyStartProps = {
  playersReady: number;
  minigames: MinigameNamesEnum[];
  numberOfMinigames?: number | 2;
  setReady: Dispatch<SetStateAction<boolean>>;
};

export const useLobbyStart = ({ playersReady, minigames, numberOfMinigames, setReady }: useLobbyStartProps) => {
  const toast = useToast();
  const [countdown, setCountdown] = useState<number | null>(null);
  const { currentPlayer, players } = usePlayersStore();
  const hasStarted = useRef<boolean>(false);

  const getRandomMinigames = (numberOfMinigames: number = 2): MinigameNamesEnum[] => {
    const allMinigames = Object.values(MinigameNamesEnum);

    // if (numberOfMinigames < 2 || numberOfMinigames > allMinigames.length) {
    //   throw new Error(`Number of minigames must be between 2 and ${allMinigames.length}, but received ${numberOfMinigames}`);
    // }

    const shuffled = [...allMinigames].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, numberOfMinigames);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (playersReady === players.length && players.length >= MIN_PLAYERS_TO_START) {
      setCountdown(() => 3);

      if ((!minigames || minigames.length === 0) && currentPlayer?.isHost === 'true') {
        minigames = getRandomMinigames(numberOfMinigames);
      }

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1 && !hasStarted.current) {
            if (currentPlayer?.isHost == 'true') {
              socket.emit('set_minigames', minigames);
              socket.emit('start_minigame', minigames[0]);
            }
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
    socket.on('failed_to_start_minigame', () => {
      toast.error({ message: 'Failed to start the game', duration: 5 });
      setReady(false);
    });

    return () => {
      socket.off('failed_to_start_minigame');
    };
  }, [socket]);

  return { countdown };
};
