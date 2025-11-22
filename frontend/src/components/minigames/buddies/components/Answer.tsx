import './Answer.scss';
import { Icon } from '@assets/icon';
import { ClassNames } from '@utils';

type AnswerProps = {
  answer: string;
  isSelected?: boolean;
  onClick?: () => void;
};

export const Answer = ({ answer, isSelected, onClick }: AnswerProps) => {
  return (
    <div className={ClassNames('answer', { clickable: !!onClick })} onClick={onClick}>
      {answer}
      <div className="answer__checkmark">{isSelected && <Icon icon="Checkmark" className="answer__icon" />}</div>
    </div>
  );
};
