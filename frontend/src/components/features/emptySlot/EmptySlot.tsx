import './EmptySlot.scss';
import { Icon } from '@assets/icon';
import { memo } from 'react';

export const EmptySlot = memo(() => {
  return (
    <div className="empty-slot">
      <div className="empty-slot__box">
        <Icon icon="Person" />
      </div>
    </div>
  );
});
