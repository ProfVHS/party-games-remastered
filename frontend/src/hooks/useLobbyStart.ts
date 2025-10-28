import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { socket } from '@socket';
import { useToast } from '@hooks/useToast';
import { usePlayersStore } from '@stores/playersStore';
import { MIN_PLAYERS_TO_START } from '@shared/constants/gameRules';

type useLobbyStartProps = {
  playerIdsReady: string[];
  setReady: Dispatch<SetStateAction<boolean>>;
};

export const useLobbyStart = ({ playerIdsReady, setReady }: useLobbyStartProps) => {
  const toast = useToast();
  const [countdown, setCountdown] = useState<number | null>(null);
  const { currentPlayer, players } = usePlayersStore();
  const hasStarted = useRef<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (playerIdsReady.length === players.length && players.length >= MIN_PLAYERS_TO_START) {
      setCountdown(() => 3);

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1 && !hasStarted.current) {
            if (currentPlayer?.isHost == 'true') {
              socket.emit('verify_minigames');
              socket.emit('start_minigame_queue', true);
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
  }, [playerIdsReady]);

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
