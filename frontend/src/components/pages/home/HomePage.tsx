import './HomePage.scss';
import { Button } from '@components/ui/button/Button.tsx';
import { JoinForm } from '@components/features/forms/JoinForm.tsx';
import { CreateForm } from '@components/features/forms/CreateForm.tsx';
import { useEffect, useState } from 'react';
import { useAnimate } from 'framer-motion';
import { Icon } from '@assets/icon';
import { socket } from '@socket';

export const HomePage = () => {
  const [scope, animate] = useAnimate();
  const [status, setStatus] = useState<'selecting' | 'join' | 'create'>('selecting');

  const changeStatus = async (status: 'join' | 'create') => {
    animate(scope.current, { scale: [1, 0.5], opacity: [1, 0] }, { duration: 0.5, type: 'spring' });
    setStatus(status);
  };

  useEffect(() => {
    animate(scope.current, { scale: [0.5, 1], opacity: [0, 1] }, { duration: 0.5, type: 'spring' });
  }, [animate, scope, status]);

  useEffect(() => {
    // Ensures the player is connected to the socket (Home page)
    if (!socket.connected) {
      socket.connect();
    }
  }, [location.pathname]);

  return (
    <div className="home-page">
      <div className="home-page__content">
        <Icon icon={'Logo'} />
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
          {status === 'join' && <JoinForm onCancel={() => setStatus('selecting')} />}
          {status === 'create' && <CreateForm onCancel={() => setStatus('selecting')} />}
        </div>
      </div>
    </div>
  );
};
