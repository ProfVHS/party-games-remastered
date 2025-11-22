import { Form } from '@components/minigames/buddies/components/Form.tsx';

type AnswerStageProps = {
  onSubmit: () => void;
};

export const AnswerStage = ({ onSubmit }: AnswerStageProps) => {
  return (
    <>
      <span className="buddies__title">Answer</span>
      <span className="buddies__nickname">Ultra Mango Guy</span>
      <span className="buddies__question">Question</span>
      <Form stage="answer" onSubmit={onSubmit} />
    </>
  );
};
