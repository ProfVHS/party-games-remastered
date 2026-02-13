import './HomePage.scss';
import { Button } from '@components/ui/button/Button.tsx';
import { JoinForm } from '@components/features/forms/JoinForm.tsx';
import { CreateForm } from '@components/features/forms/CreateForm.tsx';
import { useEffect, useState } from 'react';
import { useAnimate } from 'framer-motion';
import { Icon } from '@assets/icon';
import { socket } from '@socket';
import { useParams } from 'react-router-dom';
import { Loading } from '@components/ui/loading/Loading.tsx';

export const HomePage = () => {
  const [scope, animate] = useAnimate();
  const [status, setStatus] = useState<'loading' | 'selecting' | 'join' | 'create'>('loading');
  const { roomCode } = useParams();
  const [code, setCode] = useState<string>('');

  const changeStatus = async (status: 'join' | 'create') => {
    animate(scope.current, { scale: [1, 0.5], opacity: [1, 0] }, { duration: 0.5, type: 'spring' });
    setStatus(status);
  };

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
    const handleSocketConnect = () => {
      if (roomCode) {
        setStatus('join');
      } else {
        setStatus('selecting');
      }
    };

    if (socket.connected) {
      handleSocketConnect();
    }

    socket.on('connect', handleSocketConnect);

    return () => {
      socket.off('connect', handleSocketConnect);
    };
  }, []);

  return (
    <div className="home-page">
      {status === 'loading' ? (
        <Loading />
      ) : (
        <div className="home-page__content">
          <Icon icon={'Logo'} className="home-page__logo" />
          <span className="home-page__title">Party Games</span>
          <div className="home-page__forms" ref={scope}>
            {status === 'selecting' && (
              <>
                <Button style={{ width: '50%' }} onClick={() => changeStatus('create')}>
                  Create Room
                </Button>
                <Button style={{ width: '50%' }} onClick={() => changeStatus('join')}>
                  Join Room
                </Button>
              </>
            )}
            {status === 'join' && <JoinForm roomCode={code} onCancel={() => setStatus('selecting')} />}
            {status === 'create' && <CreateForm onCancel={() => setStatus('selecting')} />}
          </div>
        </div>
      )}
    </div>
  );
};
