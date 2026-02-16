import { Dispatch, SetStateAction, useEffect } from 'react';
import { socket } from '@socket';
import { useToast } from '@hooks/useToast';
import { PlayerType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useCountdown } from '@hooks/useCountdown.ts';

type useLobbyToggleProps = {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const useLobbyToggle = ({ setIsLoading }: useLobbyToggleProps) => {
  const setPlayers = usePlayersStore((state) => state.setPlayers);
  const { timeLeft, setEndAt } = useCountdown();
  const toast = useToast();

  useEffect(() => {
    socket.on('toggled_player_ready', handleToggledPlayerReady);
    socket.on('failed_to_toggle', handleToggledFailed);

    return () => {
      socket.off('toggled_player_ready', handleToggledPlayerReady);
      socket.off('failed_to_toggle', handleToggledFailed);
    };
  }, []);

  const handleToggledPlayerReady = (players: PlayerType[], endAt: number | null) => {
    setEndAt(endAt);
    setPlayers(players);
    setIsLoading(false);
  };

  const handleToggledFailed = () => {
    toast.error({ message: 'Failed to toggle ready status', duration: 5 });
    setIsLoading(false);
  };

  return { timeLeft };
};
