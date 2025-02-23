import './DynamicAvatars.scss';

const PlayerPositions = [
  [{ top: '5%', left: '50%', transform: 'translateX(-50%)' }],
  [
    { top: '50%', left: '10%', transform: 'translateY(-50%)' },
    { top: '50%', right: '10%', transform: 'translateY(-50%)' },
  ],
  [
    { top: '10%', left: '50%', transform: 'translateX(-50%)' },
    { bottom: '10%', left: '20%' },
    { bottom: '10%', right: '20%' },
  ],
  [
    { top: '10%', left: '50%', transform: 'translateX(-50%)' },
    { top: '50%', left: '10%', transform: 'translateY(-50%)' },
    { bottom: '10%', left: '50%', transform: 'translateX(-50%)' },
    { top: '50%', right: '10%', transform: 'translateY(-50%)' },
  ],
  [
    { top: '10%', left: '50%', transform: 'translateX(-50%)' },
    { top: '30%', left: '15%' },
    { bottom: '10%', left: '30%' },
    { bottom: '10%', right: '30%' },
    { top: '30%', right: '15%' },
  ],
  [
    { top: '10%', left: '50%', transform: 'translateX(-50%)' },
    { top: '30%', left: '15%' },
    { bottom: '20%', left: '15%' },
    { bottom: '10%', left: '50%', transform: 'translateX(-50%)' },
    { bottom: '20%', right: '15%' },
    { top: '30%', right: '15%' },
  ],
  [
    { top: '10%', left: '50%', transform: 'translateX(-50%)' },
    { top: '25%', left: '18%' },
    { bottom: '5%', left: '18%' },
    { bottom: '20%', left: '50%', transform: 'translateX(-50%)' },
    { bottom: '5%', right: '18%' },
    { top: '25%', right: '18%' },
    { top: '50%', left: '50%', transform: 'translateX(-50%)' },
  ],
  [
    { top: '10%', left: '50%', transform: 'translateX(-50%)' },
    { top: '20%', left: '20%' },
    { bottom: '10%', left: '20%' },
    { bottom: '20%', left: '50%', transform: 'translateX(-50%)' },
    { bottom: '10%', right: '20%' },
    { top: '20%', right: '20%' },
    { top: '50%', left: '30%' },
    { top: '50%', right: '30%' },
  ],
];

type DynamicAvatarProps = {
  playersReady: number;
  children: React.ReactNode;
};

const DynamicAvatars = ({ playersReady, children }: DynamicAvatarProps) => {
  if (playersReady < 1 || playersReady > PlayerPositions.length) return null;

  return (
    <div className="lobby-container">
      {children}
      {PlayerPositions[playersReady - 1].map((position, index) => (
        <div key={index} className="player-avatar" style={position}></div>
      ))}
    </div>
  );
};

export default DynamicAvatars;
