import './AppVersion.scss';

export const AppVersion = () => {
  return <div className="app-version">v{import.meta.env.VITE_APP_VERSION}</div>;
};
