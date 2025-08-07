import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import { useToast } from './useToast';
import { setSessionVariables } from '../utils';

export const useRoomJoin = () => {
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    socket.on('joined_room', (data: { roomCode: string; id: string }) => {
      setSessionVariables(data.roomCode, data.id);
      navigate('/room');
    });

    socket.on('failed_to_join_room', (playersReadyCount: number) => {
      switch (playersReadyCount as number) {
        case -1: {
          toast.error({ message: 'Room does not exist', duration: 5 });
          break;
        }
        case -2: {
          toast.error({ message: 'Room is full', duration: 5 });
          break;
        }
        case -3: {
          toast.error({ message: 'Room is in game', duration: 5 });
          break;
        }
        case -4: {
          toast.error({ message: 'Room is starting the game', duration: 5 });
          break;
        }
        case -100: {
          toast.error({ message: 'Internal server error', duration: 5 });
          break;
        }
        default: {
          toast.error({ message: 'Internal server error', duration: 5 });
          break;
        }
      }
    });

    return () => {
      socket.off('joined_room');
      socket.off('failed_to_join_room');
    };
  }, []);
};
