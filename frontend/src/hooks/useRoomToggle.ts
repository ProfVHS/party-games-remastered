import { useEffect, Dispatch, SetStateAction } from 'react';
import { socket } from '../socket';
import { useToast } from './useToast';
import { SocketPayload } from '../types';

type useRoomToggleProps = {
  setPlayersReady: Dispatch<SetStateAction<number>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const useRoomToggle = ({ setPlayersReady, setIsLoading }: useRoomToggleProps) => {
  const toast = useToast();
  useEffect(() => {
    socket.on('toggled_player_ready', (playersReadyCount: SocketPayload) => {
      setPlayersReady(playersReadyCount as number);
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
