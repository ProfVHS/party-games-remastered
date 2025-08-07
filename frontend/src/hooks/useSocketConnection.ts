import { useEffect } from 'react';
import { socket } from '../socket';
import { useNavigate } from 'react-router-dom';
import { setSessionVariables } from '../utils';
import { usePlayersStore } from '../stores/playersStore';
import { useToast } from './useToast';
import { ReturnDataType } from '../types';

export const useSocketConnection = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { fetchPlayers } = usePlayersStore();

  useEffect(() => {
    const roomCode = localStorage.getItem('roomCode');
    const playerId = localStorage.getItem('id');

    socket.emit('check_if_user_in_room', roomCode, playerId, (response: ReturnDataType) => {
      if (response.success) {
        //TODO: Fetch MinigameData I guess
        fetchPlayers();
        setSessionVariables(roomCode!, socket.id!);
      } else {
        toast.warning({ message: response.payload, duration: 3 });
        navigate('/');
      }
    });

    const handlePopState = () => {
      socket.disconnect();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
};
