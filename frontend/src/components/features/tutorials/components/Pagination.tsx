import { ClassNames } from '@utils';
import { Icon } from '@assets/icon';

type PaginatedProps = {
  page: number;
  maxPages: number;
  onClick: (delta: number) => void;
};

export const Pagination = ({ page, maxPages, onClick }: PaginatedProps) => {
  return (
    <div className="tutorial__pagination">
      <div className={ClassNames('arrow', 'left', { disabled: page === 1 })} onClick={() => onClick(-1)}>
        <Icon icon="Arrow" />
      </div>
      <span className="tutorial__pagination__indicator">
        {page} / {maxPages}
      </span>
      <div className={ClassNames('arrow', 'right', { disabled: page === maxPages })} onClick={() => onClick(1)}>
        <Icon icon="Arrow" />
      </div>
    </div>
  );
};
