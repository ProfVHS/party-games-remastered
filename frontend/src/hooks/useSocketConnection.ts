import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '@socket';
import { setSessionVariables } from '@utils';
import { useToast } from '@hooks/useToast';
import { ReturnDataType } from '@shared/types';
import { SessionDataType } from '@shared/types/GameStateType.ts';
import { useRoomStore } from '@stores/roomStore.ts';

export const useSocketConnection = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [sessionData, setSessionData] = useState<SessionDataType | null>(null);
  const setRoomSettings = useRoomStore((state) => state.setRoomSettings);

  useEffect(() => {
    const roomCode = localStorage.getItem('roomCode');
    const playerId = localStorage.getItem('id');

    if (!roomCode || !playerId) {
      toast.warning({ message: 'Error with storage variables', duration: 3 });
      navigate('/');
      return;
    }

    socket.emit('sync_player_session', roomCode, playerId, (response: ReturnDataType) => {
      if (response.success && socket.id) {
        setSessionVariables(roomCode, socket.id);
        setSessionData(response.payload.roomData);
        setRoomSettings(response.payload.settings);
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

  return { sessionData };
};
