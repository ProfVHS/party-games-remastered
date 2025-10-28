import { Dispatch, SetStateAction, useEffect } from 'react';
import { socket } from '@socket';
import { useToast } from '@hooks/useToast';

type useLobbyToggleProps = {
  setPlayerIdsReady: Dispatch<SetStateAction<string[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const useLobbyToggle = ({ setPlayerIdsReady, setIsLoading }: useLobbyToggleProps) => {
  const toast = useToast();
  useEffect(() => {
    socket.on('toggled_player_ready', (playerIdsReady: string[]) => {
      setPlayerIdsReady(playerIdsReady);
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
