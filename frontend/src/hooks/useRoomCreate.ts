import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '@socket';
import { useToast } from '@hooks/useToast';
import { setSessionVariables } from '@utils';

export const useRoomCreate = () => {
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    socket.on('created_room', (data: { roomCode: string; id: string }) => {
      setSessionVariables(data.roomCode, data.id);
      navigate('/room');
    });

    socket.on('failed_to_create_room', () => {
      toast.error({ message: 'Room creation failed', duration: 5 });
    });

    return () => {
      socket.off('created_room');
      socket.off('failed_to_create_room');
    };
  }, []);
};
