import './EmptySlot.scss';
import { Icon } from '@assets/icon';

export const EmptySlot = () => {
  return (
    <div className="empty-slot">
      <div className="empty-slot__box">
        <Icon icon="Person" />
      </div>
    </div>
  );
};
