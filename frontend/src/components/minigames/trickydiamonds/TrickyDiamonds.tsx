import './TrickyDiamonds.scss';
import HighDiamond from '@assets/textures/highDiamond.svg?react';
import MediumDiamond from '@assets/textures/mediumDiamond.svg?react';
import LowDiamond from '@assets/textures/lowDiamond.svg?react';

export const TrickyDiamonds = () => {
  return (
    <div className="tricky-diamonds">
      <div className="tricky-diamonds__title">Choose Wisely</div>
      <div className="tricky-diamonds__container">
        <div className="tricky-diamonds__diamond">
          <HighDiamond />
          <span className="tricky-diamonds__diamond__value">+200</span>
        </div>
        <div className="tricky-diamonds__diamond">
          <MediumDiamond />
          <span className="tricky-diamonds__diamond__value">+100</span>
        </div>
        <div className="tricky-diamonds__diamond">
          <LowDiamond />
          <span className="tricky-diamonds__diamond__value">+50</span>
        </div>
      </div>
    </div>
  );
};
