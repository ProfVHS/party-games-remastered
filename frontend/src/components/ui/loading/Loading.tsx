import './Loading.scss';

export const Loading = () => {
  return (
    <div className="loading">
      <div className="loading__text">Loading</div>
      <div className="loading__dot">.</div>
      <div className="loading__dot">.</div>
      <div className="loading__dot">.</div>
    </div>
  );
};
