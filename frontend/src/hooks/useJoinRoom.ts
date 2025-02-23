import { useEffect } from 'react';
import { socket } from '../socket';
import { useNavigate } from 'react-router-dom';

export const useJoinRoom = () => {
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('joined_room', () => {
      navigate('/room');
    });

    return () => {
      socket.off('joined_room');
    };
  }, [socket]);
};
