import { Dispatch, SetStateAction, useEffect } from 'react';
import { socket } from '@socket';
import { useToast } from '@hooks/useToast';
import { PlayerType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';

type useLobbyToggleProps = {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const useLobbyToggle = ({ setIsLoading }: useLobbyToggleProps) => {
  const toast = useToast();
  const { setPlayers } = usePlayersStore();

  useEffect(() => {
    socket.on('toggled_player_ready', (players: PlayerType[]) => {
      setPlayers(players);
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
