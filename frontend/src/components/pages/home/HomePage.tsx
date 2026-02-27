import './HomePage.scss';
import { Button } from '@components/ui/button/Button.tsx';
import { JoinForm } from '@components/features/forms/JoinForm.tsx';
import { CreateForm } from '@components/features/forms/CreateForm.tsx';
import { Icon } from '@assets/icon';
import { Loading } from '@components/ui/loading/Loading.tsx';
import { useHomeSocket } from '@sockets/homeSocket.ts';

export const HomePage = () => {
  const { scope, status, code, changeStatus, setStatus } = useHomeSocket();

  return (
    <div className="home-page">
      {status === 'loading' ? (
        <Loading />
      ) : (
        <div className="home-page__content">
          <Icon icon="Logo" className="home-page__logo" />
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
