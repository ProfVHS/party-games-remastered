import { ClassNames } from '@utils';
import Arrow from '@assets/textures/arrow.svg?react';

type PaginatedProps = {
  page: number;
  maxPages: number;
  onClick: (delta: number) => void;
};

export const Pagination = ({ page, maxPages, onClick }: PaginatedProps) => {
  return (
    <div className="tutorial__pagination">
      <div className={ClassNames('arrow', 'left', { disabled: page === 1 })} onClick={() => onClick(-1)}>
        <Arrow />
      </div>
      <span className="indicator">
        {page} / {maxPages}
      </span>
      <div className={ClassNames('arrow', 'right', { disabled: page === maxPages })} onClick={() => onClick(1)}>
        <Arrow />
      </div>
    </div>
  );
};
