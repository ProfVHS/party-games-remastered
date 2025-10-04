import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '@socket';
import { setSessionVariables } from '@utils';
import { usePlayersStore } from '@stores/playersStore';
import { useToast } from '@hooks/useToast';
import { ReturnDataType } from '@shared/types';
import { useRoomStore } from '@stores/roomStore.ts';

export const useSocketConnection = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { fetchPlayers } = usePlayersStore();
  const { fetchRoomSettings } = useRoomStore();

  useEffect(() => {
    const roomCode = localStorage.getItem('roomCode');
    const playerId = localStorage.getItem('id');

    socket.emit('check_if_user_in_room', roomCode, playerId, (response: ReturnDataType) => {
      if (response.success) {
        //TODO: Fetch MinigameData I guess
        fetchRoomSettings();
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
