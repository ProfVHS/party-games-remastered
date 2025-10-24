import { useEffect, Dispatch, SetStateAction } from 'react';
import { socket } from '@socket';
import { useToast } from '@hooks/useToast';

type useLobbyToggleProps = {
  setPlayersReady: Dispatch<SetStateAction<number>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const useLobbyToggle = ({ setPlayersReady, setIsLoading }: useLobbyToggleProps) => {
  const toast = useToast();
  useEffect(() => {
    socket.on('toggled_player_ready', (playersReadyCount: number) => {
      setPlayersReady(playersReadyCount);
      setIsLoading(false);
    });

    socket.on('failed_to_toggle', () => {
      toast.error({ message: 'Failed to toggle ready status', duration: 5 });
      setIsLoading(false);
    });

    return () => {
      socket.off('toggled_player_ready');
      socket.off('failed_to_toggle');
    };
  }, []);
};
