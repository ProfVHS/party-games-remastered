import './AppVersion.scss';

const version = __APP_VERSION__;

export const AppVersion = () => {
  return <div className="app-version">v{version}</div>;
};
