import './NotFound.scss';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/ui/button/Button.tsx';

export const NotFound = () => {
  const navigator = useNavigate();

  const handleGoHome = () => navigator('/');

  return (
    <div className="not-found">
      <div className="not-found__content">
        <span className="not-found__title">404</span>
        <span className="not-found__subtitle">Page not found</span>
        <span className="not-found__description">The page you are looking for does not exist.</span>
        <Button onClick={handleGoHome}>Go to Homepage</Button>
      </div>
    </div>
  );
};
