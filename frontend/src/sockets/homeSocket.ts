import { socket } from '@socket';
import { useEffect, useState } from 'react';
import { useAnimate } from 'framer-motion';
import { useParams } from 'react-router-dom';

export const useHomeSocket = () => {
  const [scope, animate] = useAnimate();
  const [status, setStatus] = useState<'loading' | 'selecting' | 'join' | 'create'>('loading');
  const { roomCode } = useParams();
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (!scope.current) return;

    animate(scope.current, { scale: [0.5, 1], opacity: [0, 1] }, { duration: 0.5, type: 'spring' });
  }, [animate, scope, status]);

  useEffect(() => {
    // Ensures the player is connected to the socket (Home page)
    if (!socket.connected) {
      socket.connect();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!roomCode) return;

    setCode(roomCode);
    setStatus('join');
  }, [roomCode]);

  useEffect(() => {
    if (socket.connected) handleSocketConnect();

    socket.on('connect', handleSocketConnect);

    return () => {
      socket.off('connect', handleSocketConnect);
    };
  }, []);

  const handleSocketConnect = () => {
    if (roomCode) {
      setStatus('join');
    } else {
      setStatus('selecting');
    }
  };

  const changeStatus = async (status: 'join' | 'create') => {
    animate(scope.current, { scale: [1, 0.5], opacity: [1, 0] }, { duration: 0.5, type: 'spring' });
    setStatus(status);
  };

  return { scope, status, code, changeStatus, setStatus };
};
