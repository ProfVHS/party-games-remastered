import { useEffect } from 'react';
import { socket } from '../socket';
import { clearSessionVariables } from '../utils';
import { useToast } from './useToast';

export const useRoomNotFound = () => {
  const toast = useToast();
  useEffect(() => {
    socket.on('room_not_found', () => {
      clearSessionVariables();
      toast.error({ message: 'Room not found', duration: 5 });
    });

    return () => {
      socket.off('room_not_found');
    };
  }, [socket]);
};
